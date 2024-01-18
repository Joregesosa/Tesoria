import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { useForm } from "@inertiajs/react";


export function EditTipoSolicitud({ hideModal, show, msj, tipoSolicitudData, setLoading }) {
    const [mensaje, setMensaje] = useState(msj);

    useEffect(() => {
        setMensaje(msj)
       
    }, [msj])
    
    const categorySolicitud = [
        { id: 1, category: 'Servicios' },
        { id: 2, category: 'Certificaciones' },
        { id: 3, category: 'Estados Financieros' },
        { id: 4, category: 'Reportes Generales' }
    ]

    const { data, setData, post, reset } = useForm({
        id: tipoSolicitudData?.id,
        nombre: tipoSolicitudData?.nombre,
        tipo: tipoSolicitudData?.tipo,
        status: tipoSolicitudData?.status
    });

    function submit(e) {
        e.preventDefault();
        hideModal()
        setLoading(true);

        post(route('tipoSolicitud.update', tipoSolicitudData.id), {
            onSuccess: () => {
                reset()
                setLoading(false);
            }
        });

    }


    return (

        <Modal show={show} maxWidth='md'>
            <h1 className='w-100% py-4 text-lg text-center font-bold'>Editar Tipo de Solicitud</h1>'

            <form className="flex flex-col gap-4 text-textgray">

                <div className='flex gap-8'>
                    <div className="flex flex-col w-full">
                        <label htmlFor="name" className="text-xs">
                            Nombre de la Solicitud
                        </label>
                        <input type="text" name="name" id="name" required className="h-9 rounded-md w-full outline-none"
                            value={data.nombre}
                            placeholder='Diseño Web'
                            onChange={(e) => setData('nombre', e.target.value)}
                        />
                    </div>
                </div>

                <div className='flex gap-8'>

                    <div className="flex flex-col w-3/5">
                        <label htmlFor="tipo" className="text-xs">
                            Categoria de la solicitud
                        </label>

                        <select name="tipo" id="tipo" className="w-full py-1 px-2 bg-white rounded-md outline-none"
                            required
                            defaultValue={data.tipo}
                            onChange={(e) => setData('tipo', e.target.value)}
                        >

                            <option value="" disabled>
                                Selecionar Categoria
                            </option>
                            {categorySolicitud.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.category}
                                </option>

                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col w-2/5">
                        <label htmlFor="tipo" className="text-xs">
                           Estado
                        </label>

                        <select name="status" id="status" className="w-full py-1 px-2 bg-white rounded-md outline-none"
                            defaultValue={data.status}
                            required
                            onChange={(e) => setData('status', e.target.value)}
                        >

                            <option value="" disabled>
                                Status
                            </option>

                            <option value={1}>
                                Activo
                            </option>
                            <option value={0}>
                                Inactivo
                            </option>

                        </select>
                    </div>
                </div>
                {mensaje?.error && <span className='text-red-500 text-xs italic'>{mensaje?.error[0]}</span>}


            </form>
            <div className='flex justify-end'>
                <button type='button' className="border py-1 w-32 rounded-xl bg-red-500 hover:bg-red-400 text-offwhite q mr-4 mt-5"
                    onClick={() => { hideModal(); reset(); }}
                >
                    Cancelar
                </button>

                <button onClick={submit}
                    className="border py-1 w-32 rounded-xl bg-blue-500 hover:bg-blue-600 text-offwhite self-end justify-end  mt-5">
                    Guardar
                </button>
            </div>

        </Modal>
    )
}
