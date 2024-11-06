import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 No Encontrado",
};

export default function NotFound() {
  return (
    <div className="py-16 w-full min-h-screen flex justify-center md:items-center bg-white">
      <div className="mx-auto max-w-xl lg:max-w-4xl flex flex-col lg:flex-row">
        <div className="relative px-5 lg:border-r-2 border-gray-100">
          <p className="absolute -top-3 md:top-0 left-10 md:left-20 text-base md:text-4xl text-indigo-600 font-bold uppercase">
            Error
          </p>
          <p className="text-7xl md:text-10xl text-gray-700 font-extrabold tracking-wider">404</p>
        </div>

        <div className="px-5">
          <p className="text-3xl md:text-5xl text-gray-700 font-bold tracking-wide">
            Pagina no encontrada
          </p>
          <p className="mt-4 text-sm md:text-base text-gray-500 font-medium">
            La pagina a la que intentaste acceder no existe, pudo ser removida o actualizada.<br />
            <br />
            ¡Lo sentimos! Regresa a la pagina principal.
          </p>
          <Link
            href="/"
            className="mt-10 relative inline-flex items-center px-7 py-3.5 rounded border border-transparent bg-indigo-600 md:text-lg text-white font-medium hover:bg-indigo-700"
          >
            Volver al inicio.
          </Link>
        </div>
      </div>
    </div>
  );
}