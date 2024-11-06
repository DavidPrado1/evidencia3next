import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        nickname: true,
        email: true,
        nombres: true,
        apellidos: true,
        fechaNacimiento: true,
        sexo: true,
      },
    });

    return NextResponse.json(users, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { message: 'Token inválido o expirado' },
      { status: 401 }
    );
  }
}
