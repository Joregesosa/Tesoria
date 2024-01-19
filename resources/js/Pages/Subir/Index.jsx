
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';


export default function subir({auth,file,solicitudes}) {



    const today = new Date();
    const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`; // Formatea la fecha como dd/mm/yyyy


    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'));
    };


    return (

        <AuthenticatedLayout
            countNotificaciones={auth.countNotificaciones}
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">
                Formulario subir doumentos
            </h2>}
        >
            <Head title="Form" />


            <div className="w-[calc(100%-3rem)] h-[calc(100%-3rem)] bg-[#f2f2f2] m-6 rounded-md flex flex-col gap-10 p-10">

                <form className="flex flex-col w-2/5 gap-4 text-textgray">

                   

                       
                    <div className="flex gap-4 ">
                    <label  className="text-xs flex flex-col ">Solicitud
                    <select name="services" id="services" className="h-9 rounded-md  outline-none px-2">
                    
                    <option value="">Seleccione servicio</option>
                    {solicitudes.map((solicitud) => (
                        <option key={solicitud.id} value={solicitud.id}>
                            {solicitud.numero}-{solicitud.tipo.nombre}
                        </option>

                    ))}
                      </select>
                     </label>

                    <label htmlFor="rnc" className="text-xs flex flex-col ">
                             Fecha
                            <input disabled type="text" name="date" value={formattedDate} className="h-9 rounded-md w-3/5 outline-none px-2" />
                        </label>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="name" className="text-xs">
                            Nombre solicitante
                        </label>
                        <input type="text" name="name" id="name" value={auth.user.name} className="h-9 rounded-md w-4/5 outline-none px-2" />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="phone" className="text-xs">
                            Número contacto
                        </label>
                        <input type="text" name="phone" id="phone" value={auth.user.telefono} className="h-9 rounded-md w-3/5 outline-none px-2" />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-xs">
                            Correo electrónico
                        </label>
                        <input type="text" name="email" id="email" value={auth.user.email} className="h-9 rounded-md w-4/5 outline-none px-2" />
                    </div>

                    <div className="flex flex-col">

                        <label htmlFor="coment" className="text-xs">
                            Descripcion
                        </label>

                        <textarea placeholder="Escribe tu descripcion" name="coment" id="coment" className="w-full resize-none h-44 p-3 outline-none "></textarea>
                    </div>


                    <button className="border py-1 w-36 rounded-xl bg-gray-300 hover:bg-gray-200 text-textgray self-end justify-end mr-5 mt-5">
                        Enviar solicitud
                    </button>
                </form>

            </div>

        </AuthenticatedLayout>
    )

}
