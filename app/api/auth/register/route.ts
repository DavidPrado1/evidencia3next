import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { AxiosError } from 'axios';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { nickname, email, nombres, apellidos, fechaNacimiento, sexo, password } = await req.json();

  // Verificar que todos los campos requeridos estén presentes
  if (!nickname || !email || !password || !nombres || !apellidos || !fechaNacimiento || !sexo) {
    return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
  }

  // Verificar que la fecha de nacimiento sea válida
  const parsedFechaNacimiento = new Date(fechaNacimiento);
  if (isNaN(parsedFechaNacimiento.getTime())) {
    return NextResponse.json({ message: 'Invalid birthdate format' }, { status: 400 });
  }

  try {
    // Verificar si el usuario ya existe en la base de datos
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario en la base de datos
    const user = await prisma.user.create({
      data: {
        nickname,
        email,
        nombres,
        apellidos,
        fechaNacimiento: parsedFechaNacimiento,  // Usar la fecha convertida
        sexo,
        hashedPassword,  // Almacenar la contraseña encriptada
      },
    });

    // Crear el usuario en Keycloak
    const keycloakUrl = `${process.env.KEYCLOAK_ISSUER_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users`;
    console.log(keycloakUrl)
    console.log(process.env.KEYCLOAK_CLIENT_ID)
    console.log(process.env.KEYCLOAK_CLIENT_SECRET)

    // Obtener el token de acceso de Keycloak para la API de administración
    const adminTokenUrl = `${process.env.KEYCLOAK_ISSUER_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`;
    console.log(adminTokenUrl)
    const adminTokenResponse = await axios.post(
      adminTokenUrl,
      new URLSearchParams({
        client_id: process.env.KEYCLOAK_CLIENT_ID as string,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET as string,
        grant_type: 'client_credentials',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const adminAccessToken = adminTokenResponse.data.access_token;

    // Crear el usuario en Keycloak
    const keycloakUser = {
      username: nickname,
      email: email,
      firstName: nombres,
      lastName: apellidos,
      enabled: true,
      emailVerified: true,
      credentials: [
        {
          type: 'password',
          value: password,  // La contraseña en texto claro para Keycloak
          temporary: false,
        },
      ],
    };

    console.log(keycloakUser)

    // Enviar solicitud para crear el usuario en Keycloak
    const keycloakResponse = await axios.post(keycloakUrl, keycloakUser, {
      headers: {
        Authorization: `Bearer ${adminAccessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Usuario creado exitosamente en Keycloak:', keycloakResponse.data);

    // Responder con el registro exitoso
    return NextResponse.json({ message: 'User registered successfully', user });

  } catch (error: unknown) {
    // Manejo de errores detallado para la depuración

    console.error('Error en el proceso de creación del usuario:', error);

    // Verificar si el error es un AxiosError
    if (axios.isAxiosError(error)) {
      // Error de la respuesta de Keycloak (código de estado no 2xx)
      if (error.response) {
        console.error('Error de Keycloak:', error.response.status, error.response.data);
        return NextResponse.json({ message: `Keycloak error: ${error.response.status}`, details: error.response.data }, { status: 500 });
      } else if (error.request) {
        // La solicitud fue realizada pero no se recibió respuesta
        console.error('No se recibió respuesta de Keycloak:', error.request);
        return NextResponse.json({ message: 'No response from Keycloak' }, { status: 500 });
      } else {
        // Error en la configuración de la solicitud
        console.error('Error en la configuración de la solicitud a Keycloak:', error.message);
        return NextResponse.json({ message: `Request setup error: ${error.message}` }, { status: 500 });
      }
    } else if (error instanceof Error) {
      // Si el error es una instancia de Error, podemos acceder a message
      console.error('Error general:', error.message);
      return NextResponse.json({ message: 'Internal server error', details: error.message }, { status: 500 });
    } else {
      // Si el error no es del tipo conocido, imprime lo que sea que sea
      console.error('Error desconocido:', error);
      return NextResponse.json({ message: 'Unknown error occurred', details: String(error) }, { status: 500 });
    }
  }
}
