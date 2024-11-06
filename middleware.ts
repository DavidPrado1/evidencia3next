import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

const KEYCLOAK_URL = process.env.KEYCLOAK_ISSUER_URL!;
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM!;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID!;

async function isTokenValid(token: string): Promise<boolean> {
  try {
    const response = await axios.get(
      `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.status === 200;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value; 
  const url = req.url;

  if (url.includes('/auth/')) {
    if (token && (await isTokenValid(token))) {
      return NextResponse.redirect(new URL('/protected/tabla', req.url));
    }
    return NextResponse.next();
  }

  if (url.includes('/protected/')) {
    if (!token || !(await isTokenValid(token))) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    return NextResponse.next();
  }

  if (url.startsWith('/api/protected/')) {
    if (!token || !(await isTokenValid(token))) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/:path*', '/protected/:path*', '/api/protected/:path*'],
};
