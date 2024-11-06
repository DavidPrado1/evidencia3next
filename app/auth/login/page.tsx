"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function LoginPage() {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/login', { nickname, password });
      router.push('/protected/tabla');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nickname</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-md"
          >
            Iniciar Sesión
          </button>
          <p className="text-center text-sm text-gray-500 mt-4">
            ¿No tienes cuenta?{' '}
            <a href="/auth/register" className="text-blue-600 hover:underline">
              Regístrate
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
