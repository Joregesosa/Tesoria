import React from 'react';
import { Link } from '@inertiajs/react';
const navItems = [

    {
        id: 1,
        icon: "/assets/svg/home.svg",
        title: "Inicio",
        route: route('home'),
        rol: [1,2,3]
    },

    {
        id: 2,
        icon: "/assets/svg/soli.svg",
        title: "Administración de solicitudes",
        route: route('admsolicitudes'),
        rol: [1,2,3]
      
    },

    {
        id: 3,
        icon: "/assets/svg/doc.svg",
        title: "Panel De Documentos",
        route:  route('panel'),
        rol: [1,2,3]
    },

    {
        id: 5,
        icon: "/assets/svg/file.svg",
        title: "Solictudes",
        route: route('solicitudes'),
        rol: [2]
    },

    {
        id: 6,
        icon: "/assets/svg/user.svg",
        title: "Usuarios",
        route:  route('usuarios.index') ,
        rol: [1]
 
    },

    {
        id: 7,
        icon: "/assets/svg/database2.svg",
        title: "Reportes",
        route:  route('reportes'),

        rol: [1,3]
    },
    {
        id: 8,
        icon: "/assets/svg/board2.svg",
        title: "Dashboard",
        route:  route('dashboard'),
        rol: [1,3]

    },
    {
        id: 9,
        icon: "/assets/svg/tools.svg",
        title: "Mantenimiento",
        route:  route('empresa.index'),
        rol: [1]

    }
];

export default function SideNav({user}) {

    return (
        <nav className='flex min-h-full bg-darkgray lef-0 w-28 top-[60px] fixed'>

            <ul className='flex flex-col '>

                {navItems.map(item => (
                  item.rol.includes(user.rol_id) ?(
                    <li key={item.id} className={` ${user.rol_id == 2 ? ' h-[15vh]' : ' h-[13vh]'}  `}>
                        <Link href={item.route} className='w-28 h-full flex flex-col items-center justify-center text-gray-200 hover:bg-nav cursor-pointer text-xs gap-2'>
                            <img src={item.icon} className='w-[6vh] h-[6vh]'   alt='icon' />

                            <span className='fit text-center'>
                                {item.title}
                            </span>
                        </Link>
                    </li>
                   ) :(null)
                ))}

            </ul>
        </nav>
    )
}
