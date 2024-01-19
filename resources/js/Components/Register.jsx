import React from 'react'

export default function Register({ roles, setData, isCliente, data, submit, changeRol, hideModal, msj }) {
    return (
        <>
            <form onSubmit={submit} className="flex flex-col gap-4 text-textgray">
                <div className='flex gap-8'>
                    <div className="flex flex-col w-3/5">
                        <label htmlFor="name" className="text-xs">
                            Nombre Completo
                        </label>
                        <input type="text" name="name" id="name" className="h-9 rounded-md w-full outline-none"
                            value={data.name} required
                            onChange={(e) => setData('name', e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col w-2/5">
                        <label htmlFor="telefono" className="text-xs">
                            Número contacto
                        </label>
                        <input type="tel" name="telefono" id="telefono" className="h-9 rounded-md full outline-none px-2"
                            value={data.telefono} required
                            onChange={(e) => setData('telefono', e.target.value)}
                        />
                    </div>
                </div>

                <div className='flex gap-8'>
                    <div className="flex flex-col w-3/5">
                        <label htmlFor="email" className="text-xs">
                            Correo electrónico
                        </label>
                        <input type="email" name="email" id="email" className="h-9 rounded-md w-full outline-none px-2"
                            value={data.email} required
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col w-2/5">
                        <label htmlFor="email" className="text-xs">
                            Asignar Rol
                        </label>

                        <select name="rol_id" id="rol_id" className="w-full p-1 bg-white rounded-md outline-none"
                            onChange={changeRol} required
                        >
                            <option value="">
                                Seleccione Rol
                            </option>
                            {roles.map(rol => (
                                <option key={rol.id} value={rol.id}>
                                    {rol.nombre}
                                </option>

                            ))}
                        </select>
                    </div>
                </div>

                {isCliente &&

                    <div className='flex gap-8'>
                        <div className="flex flex-col w-2/4">
                            <label htmlFor="name" className="text-xs">
                                Empresa
                            </label>
                            <input type="text" name="name" id="name" className="h-9 rounded-md outline-none px-2" onChange={(e) => setData('empresa', e.target.value)}/>
                        </div>

                        <div className="flex flex-col w-2/4">
                            <label htmlFor="rnc" className="text-xs">
                                RNC
                            </label>
                            <input type="text" name="rnc" id="rnc" className="h-9 rounded-md outline-none px-2" onChange={(e) => setData('rnc', e.target.value)}/>
                        </div>
                    </div>
                }
                {msj?.error && <span className='text-red-500 text-xs italic'>{msj?.error[0]}</span>}
                <div className='flex justify-end'>
                    <button className="border py-1 w-36 rounded-xl bg-red-500 hover:bg-red-400 text-offwhite q mr-5 mt-5"
                        type='button'
                        onClick={hideModal}
                    >
                        Cancelar
                    </button>

                    <button type='submit'
                        className="border py-1 w-36 rounded-xl bg-blue-500 hover:bg-blue-600 text-offwhite self-end justify-end mr-5 mt-5">
                        Registrar
                    </button>
                </div>
            </form>


        </>
    )
}
