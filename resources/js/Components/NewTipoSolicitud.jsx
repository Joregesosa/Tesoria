import React, { useState } from 'react';
import Modal from './Modal';
import { useForm } from "@inertiajs/react";


export function NewTipoSolicitud({ submit, hideModal, show, msj, setLoading }) {
    const [mensaje, setMensaje] = useState(msj);
    const categorySolicitud = [
        { id: 1, category: 'Servicios' },
        { id: 2, category: 'Certificacioens' },
        { id: 3, category: 'Estados Financieros' },
        { id: 4, category: 'Reportes Generales' }
    ]
    const { data, setData, post, reset } = useForm({
        id: 0,
        nombre: '',
        tipo: ''
    });

    function submit(e) {
        e.preventDefault();

        if (data.name === '' || data.tipo === '') {
            setMensaje({ error: ['Todos los datos son campos requeridos'] })
            return;
        }
        setLoading(true)
        hideModal(true)
        post(route('tipoSolicitud.create'), {
            onSuccess: () => {
                setLoading(false)
            }
        });

    }

    return (

        <Modal show={show} >
            <h1 className='w-100% py-4 text-lg text-center'>Nuevo Tipo de Solicitud</h1>'

            <form onSubmit={submit} className="flex flex-col gap-4 text-textgray">
                <div className='flex gap-8'>
                    <div className="flex flex-col w-3/5">
                        <label htmlFor="name" className="text-xs">
                            Tipo de la solicitud
                        </label>
                        <input type="text" name="name" id="name" required className="h-9 rounded-md w-full outline-none"
                            placeholder='Nombre del tipo'
                            onChange={(e) => setData('nombre', e.target.value)}
                        />
                    </div>



                    <div className="flex flex-col w-2/5">
                        <label htmlFor="tipo" className="text-xs">
                            Categoria de la solicitud
                        </label>

                        <select name="tipo" id="tipo" className="w-full py-1 px-2 bg-white rounded-md outline-none"
                            required
                            onChange={(e) => setData('tipo', e.target.value)}
                        >

                            <option value="">
                                Selecionar Categoria
                            </option>
                            {categorySolicitud.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.category}
                                </option>

                            ))}
                        </select>
                    </div>
                </div>
                {mensaje?.error && <span className='text-red-500 text-xs italic'>{mensaje?.error[0]}</span>}
                <div className='flex justify-end'>
                    <button type='button' className="border py-1 w-36 rounded-xl bg-red-500 hover:bg-red-400 text-offwhite q mr-5 mt-5"
                        onClick={hideModal}
                    >
                        Cancelar
                    </button>

                    <button type='submit' onClick={submit}
                        className="border py-1 w-36 rounded-xl bg-blue-500 hover:bg-blue-600 text-offwhite self-end justify-end mr-5 mt-5">
                        Guardar
                    </button>
                </div>

            </form>

        </Modal>
    )
}
