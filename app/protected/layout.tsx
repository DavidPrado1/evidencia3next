"use client"

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const logout = async () => {
        const response = await fetch('/api/auth/logout', { method: 'POST' });
        if (response.ok) {
            router.push('/auth/login');
        } else {
            console.error('Error al realizar el logout');
        }
    };
    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
                <Suspense fallback={<div>Loading...</div>}>
                    <button className="bg-red-600 p-2 rounded-lg hover:bg-red-700 transition" onClick={logout}>Cerrar sesión</button>
                </Suspense>
            </header>

            <main className="p-8">
                {children}
            </main>
        </div>
    );
}
