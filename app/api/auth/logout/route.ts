import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get('accessToken');
  console.log(accessToken?.value)

  if (!accessToken) {
    return NextResponse.redirect('/auth/login'); 
  }

  if (!accessToken.value) {
    return NextResponse.redirect('/auth/login');
  }

  (await cookieStore).delete('accessToken');
  return NextResponse.json({ message: 'Deslogueado' }, { status: 200 });
  

}
