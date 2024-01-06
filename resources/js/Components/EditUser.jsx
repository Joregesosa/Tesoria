import React from 'react'

export default function EditUser({ roles, changeRol, hideModal, update, selectedUser, setData, isCliente, msj, data }) {

    console.log(selectedUser)
    return (
    
        
            <form onSubmit={update} className="flex flex-col gap-4 text-textgray">

            <div className='flex gap-8'>
                <div className="flex flex-col w-3/5">
                    <label htmlFor="name" className="text-xs">
                        Nombre Completo
                    </label>
                    <input type="text" name="name" id="name" className="h-9 rounded-md w-full outline-none"
                        value={data.name || selectedUser.name} required
                        onChange={(e) => setData('name', e.target.value)}
                    />
                </div>

                <div className="flex flex-col w-2/5">
                    <label htmlFor="telefono" className="text-xs">
                        Número contacto
                    </label>
                    <input type="tel" name="telefono" id="telefono" className="h-9 rounded-md full outline-none px-2"
                        value={data.telefono || selectedUser.telefono} required
                        onChange={(e) => setData('telefono', e.target.value)}
                    />
                </div>
            </div>

            <div className='flex gap-8'>
                <div className="flex flex-col w-2/4">
                    <label htmlFor="rol_id" className="text-xs">
                        Asignar Rol
                    </label>

                    <select name="rol_id" id="rol_id" className="w-full p-1 bg-white rounded-md outline-none"
                        defaultValue={selectedUser.rol_id}
                        onChange={changeRol}
                    >
                        <option value="">
                            Seleccione Rol
                        </option>
                        {roles.map(rol => (
                            <option value={rol.id} key={rol.id}>
                                {rol.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col w-2/5">
                        <label htmlFor="tipo" className="text-xs">
                            Estadoss
                        </label>

                        <select name="status" id="status" className="w-full py-1 px-2 bg-white rounded-md outline-none"
                            defaultValue={selectedUser.status}
                            required
                            onChange={(e) => setData('status', e.target.value)}
                        >

                            <option value="1">
                                Activo
                            </option>
                            <option value="0">
                                Inactivo
                            </option>

                        </select>
                    </div>

            </div>
            {isCliente &&

                <div className='flex gap-8'>
                    <div className="flex flex-col w-2/4">
                        <label htmlFor="name" className="text-xs">
                            Empresa
                        </label>
                        <input type="text" name="name" id="name" className="h-9 rounded-md outline-none px-2" value={data.empresa || selectedUser.empresa} onChange={(e) => setData('empresa', e.target.value)} />
                    </div>

                    <div className="flex flex-col w-2/4">
                        <label htmlFor="rnc" className="text-xs">
                            RNC
                        </label>
                        <input type="text" name="rnc" id="rnc" className="h-9 rounded-md outline-none px-2" value={data.rnc || selectedUser.rnc} onChange={(e) => setData('rnc', e.target.value)} />
                    </div>

                </div>
            }
            {msj?.error && <span className='text-red-500 text-xs italic'>{msj?.error[0]}</span>}
            <div className='flex justify-end'>
                <button type='button' className="border py-1 w-36 rounded-xl bg-red-500 hover:bg-red-400 text-offwhite q mr-5 mt-5"
                    onClick={hideModal}
                >
                    Cancelar
                </button>

                <button type='submit' className="border py-1 w-36 rounded-xl bg-blue-500 hover:bg-blue-600 text-offwhite self-end justify-end mr-5 mt-5">
                    Registrar
                </button>
            </div>

        </form>


    )
}
