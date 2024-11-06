"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  nickname: string;
  email: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: Date;
  sexo: 'masculino' | 'femenino';
}

export default function TablaPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {

      try {
        const response = await fetch('/api/protected/tabla', {
          method: 'GET',
        });

        if (response.ok) {
          const data: User[] = await response.json();
          setUsers(data);
        } else {
          console.error('Error al obtener usuarios:', response.statusText);
          if (response.status === 401) {
            router.push('/auth/login');
          }
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-2xl font-semibold mb-6">Tabla de Usuarios</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="border-b py-3 px-4 text-left">Nickname</th>
              <th className="border-b py-3 px-4 text-left">Email</th>
              <th className="border-b py-3 px-4 text-left">Nombres</th>
              <th className="border-b py-3 px-4 text-left">Apellidos</th>
              <th className="border-b py-3 px-4 text-left">Fecha de Nacimiento</th>
              <th className="border-b py-3 px-4 text-left">Sexo</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-100 transition-colors duration-200">
                <td className="border-b py-2 px-4">{user.nickname}</td>
                <td className="border-b py-2 px-4">{user.email}</td>
                <td className="border-b py-2 px-4">{user.nombres}</td>
                <td className="border-b py-2 px-4">{user.apellidos}</td>
                <td className="border-b py-2 px-4">{new Date(user.fechaNacimiento).toLocaleDateString()}</td>
                <td className="border-b py-2 px-4">{user.sexo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
