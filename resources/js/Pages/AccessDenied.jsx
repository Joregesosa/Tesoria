import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import dashimg from "/public/assets/fondo2.jpg";
import letra from "/public/assets/fondo.jpg";



export default function Dashboard({ auth }) {



  return (
    <AuthenticatedLayout
      countNotificaciones={auth.countNotificaciones}
      user={auth.user}
    >
      <div className="font-ubuntu pb-20 bg-[#332851] w-full h-[calc(100vh-64px)] relative overflow-hidden flex items-center justify-center flex-col">
        <h1 className="acceso-403">403</h1>
        <h2 className="acceso-denegado">Acceso Denegado</h2>

        <Link href={route('home')} className='acceso-home cursor-pointer '>
          ir al Inicio
        </Link>
      </div>
    </AuthenticatedLayout>
  );
}
