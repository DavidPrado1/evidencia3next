import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { nickname, password } = await req.json();

  if (!nickname || !password) {
    return NextResponse.json({ message: 'Nickname and password are required' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { nickname },
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword!);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const keycloakTokenUrl = `${process.env.KEYCLOAK_ISSUER_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`;

    const tokenResponse = await axios.post(
      keycloakTokenUrl,
      new URLSearchParams({
        client_id: process.env.KEYCLOAK_CLIENT_ID!,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
        grant_type: 'password',
        username: nickname,
        password,
        scope: 'openid',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token: accessToken } = tokenResponse.data;

    const response = NextResponse.json({ message: 'Login successful', accessToken });
    response.cookies.set('accessToken', accessToken, { httpOnly: true, maxAge: 1800 });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
