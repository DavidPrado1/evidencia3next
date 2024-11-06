
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      nickname: string;
      email: string;
      nombres: string;
      apellidos: string;
      fechaNacimiento: Date;
      sexo: 'masculino' | 'femenino';
      accessToken?: string;
    };
  }

  interface User {
    id: string;
    nickname: string;
    email: string;
    nombres: string;
    apellidos: string;
    fechaNacimiento: Date;
    sexo: 'masculino' | 'femenino';
    hashedPassword?: string;
  }
}
