import React, { useEffect, useReducer, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Solicitud } from "@/Components/Solicitud";
import { format } from "date-fns";
import Modal from "@/Components/Modal";


export default function admsolicitudes({ auth, tipoSolicitudes, msj, solicitud_id, statusList }) {



    const solicitudes = auth.user.solicitudes.filter(solicitud => solicitud.tipo_id > 2);

    const [dato, setdato] = useState(null);
    const [open, setOpen] = useState(0);
    const [select, setSelet] = useState(0);
    const [datos_f, setDatos_f] = useState(solicitudes);
    const [edit, setEdit] = useState(false);
    const { data, setData, post } = useForm(null);
    const [show, setShow] = useState(msj != null);
    const [isOpenModalStatus, setIsOpenModalStatus] = useState(false);
    const [comentario, setComentario] = useState("");
    const [verFiltro, setVerFiltro] = useState(false);

    const [filtro, setFiltro] = useState({
        estado: 0,
        todas: false,
        texto: "",
    });

    useEffect(() => {
        setDatos_f(solicitudes);
        if (open) {
            const solicitudSeleccionada = solicitudes.find(
                (solicitud) => solicitud.id === open
            );
            setdato(solicitudSeleccionada);
            setData(solicitudSeleccionada);
        }

    }, [auth.user.solicitudes]);

    useEffect(() => {
        if (msj?.error == null || msj?.error == []) {
            setComentario("");
            setShow(msj != null);
        }
    }, [msj]);


    useEffect(() => {
        
        if (solicitud_id && !open) {
          
            abrir(parseInt(solicitud_id));
        }
    }, [solicitud_id]);


    useEffect(() => {


        const filtered = solicitudes.filter((soli) => {

           
            if (filtro.estado && soli.status_id !== filtro.estado) {
                return false;
            }

            if (!filtro.todas && soli.status_id > 4 && filtro.estado < 4) {
                return false;
            }

            if (filtro.texto && !JSON.stringify(soli).toLowerCase().includes(filtro.texto)) {
                return false;
            }

            return true;
        });

        setDatos_f(filtered);

    }, [filtro]);

    const abrir = (solicitudId) => {
      
        if (open == solicitudId) {
          
            setOpen(0);
            setTimeout(() => setdato(null), 500);


        } else {
           
            setOpen(solicitudId);
            const solicitudSeleccionada = solicitudes.find(
                (solicitud) => solicitud.id === solicitudId
            );
            setdato(solicitudSeleccionada);
            setData(solicitudSeleccionada);
        }
    };


    const put = (id) => {
        if (select == id) {
            setSelet(0)
        } else {
            setSelet(id)
        }
    };

    const handleDownload = (archivo) => {
        const id = archivo.id;
        const filename = archivo.nombre + '.' + archivo.extencion;

        axios
            .post('/download', { id }, { responseType: 'blob' })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
            })
            .catch((error) => {
                console.error('Error al descargar el archivo:', error);
            });
    };

    const submit = (e) => {
        e.preventDefault();
        

        post(route("solicitud.update"));
    };


    return (
        <AuthenticatedLayout user={auth.user}
            msj={msj}
            countNotificaciones={auth.countNotificaciones}
            solicitud_id={open}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Administración de solicitudes</h2>}

        >
            <Head title="Solicitudes" />

            <div className=" pb-1  ">
                <div className=" m-5 h-full bg-white shadow-lg   rounded-md gap-10 p-10 pt-4">
                    <div className="flex gap-3 mb-5 border-b-2 pb-2">


                        <label className=" flex items-center border-2 border-black w-80 h-9 text-sm bg-white rounded-lg overflow-hidden p-2 font-medium">
                            Buscar
                            <input onChange={(e) => setFiltro({ ...filtro, texto: e.target.value })} className="border-none h-full w-full outline-none focus:ring-0" />

                        </label>
                        <div className="cursor-pointer flex items-center" onClick={() => {setVerFiltro(!verFiltro), verFiltro &&  setFiltro({
                        estado: 0,
                        todas: false,
                        texto: filtro.texto,
                    })}}>
                            <img className="w-5 h-5" src={`/assets/svg/${verFiltro ? "nofilter.svg":"filter.svg"}`} alt="" />
                        </div>
                        <div className={`${verFiltro ? "w-[35rem]":"w-0"} overflow-hidden transition-all duration-500`}>
                            <div className="flex gap-4">
                                <label className="flex gap-3 items-center"  >
                                    <span className='font-semibold'> Estados:</span>

                                    <select
                                        required
                                        value={filtro.estado}
                                        onChange={(e) => setFiltro({ ...filtro, estado: parseInt(e.target.value) })}
                                        name="tipo_id"
                                        id="tipo_id"
                                        className="p-0 px-2 w-fit rounded-md h-8"
                                    >
                                        <option value={0} select>Todas</option>
                                        {statusList.map((estado) => (
                                            <option key={estado.id} value={estado.id}>
                                                {estado.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className=' relative inline-flex gap-2 cursor-pointer select-none items-center '>

                                    <span className="whitespace-nowrap">Mostrar Completas: </span>
                                    <input type='checkbox' name='autoSaver' className='sr-only' checked={filtro.todas}
                                        onChange={(e) => setFiltro({ ...filtro, todas: e.target.checked })} />
                                    <span className={` mr-3 flex h-[24px] w-[43px] items-center rounded-full p-1 duration-200  ${filtro.todas ? 'bg-blue-500' : 'bg-[#CCCCCE]'}`} >
                                        <span className={` h-[17px] w-[17px] rounded-full bg-white duration-200 ${filtro.todas ? 'translate-x-4' : ''}`}></span>
                                    </span>

                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex  gap-16">
                        <ul className="flex flex-col col gap-4 overflow-hidden overflow-y-scroll  h-full max-h-[740px] p-2 rounded-md pe-8  ">

                            {datos_f?.length ? (datos_f.map((solicitud) => (
                                <Solicitud
                                    adm={auth.user.id != 2}
                                    key={solicitud.id}
                                    data={solicitud}
                                    click={() => abrir(solicitud.id)}
                                    open={open}
                                />
                            ))) : (<h1>No hay Solicitudes</h1>)}
                        </ul>

                        <div className={`flex flex-col gap-3  ${open ? "w-[600px]" : "w-0 opacity-0 "}   p-4 bg-gray-200 rounded-md shadow-xl ms-4    overflow-hidden transition-all duration-500 `}>
                            {dato ? (

                                <>

                                    <table >
                                        <tbody className=" bg-white py-2 p-4 rounded-md flex justify-between " >
                                            <tr className="w-full">
                                                <td className="font-bold w-44 py-2 whitespace-nowrap">
                                                    Nombre solicitante
                                                </td>
                                                <td className="">
                                                    {dato.user.name}
                                                </td>
                                            </tr>
                                            {(dato.status_id == 1 && auth.user.id == dato.user.id) &&

                                                <div className="font-bold  flex justify-end items-center">
                                                    <button onClick={() => setEdit(true)} className="bg-blue-400 px-2 py-1 rounded-lg font-semibold text-white"> Editar </button>
                                                </div>
                                            }

                                        </tbody>
                                    </table>


                                    <div className="bg-white  py-2 p-4 rounded-md overflow-hidden opacity-100">
                                        <table >
                                            <tbody >
                                                <tr className="w-fit p-6">
                                                    <td className="font-bold w-44 py-2">
                                                        Número solicitud
                                                    </td>
                                                    <td>{dato.numero}</td>
                                                </tr>
                                                <tr className="w-fit">
                                                    <td className="font-bold w-44 py-2">
                                                        Fecha
                                                    </td>
                                                    <td>
                                                        {format(
                                                            new Date(dato.created_at),
                                                            "dd/MM/yyyy hh:mm:ss a"
                                                        )}
                                                    </td>
                                                </tr>

                                                <tr className="w-fit">
                                                    <td className="font-bold w-44 py-2">
                                                        Tramite
                                                    </td>
                                                    <td>{dato.tipo.nombre}</td>
                                                </tr>
                                                {auth.user.rol_id !== 2 && (
                                                    <>
                                                        <tr className="w-fit">
                                                            <td className="font-bold w-44 py-2">
                                                                Nombre empresa
                                                            </td>
                                                            <td>{dato.user.empresa}</td>
                                                        </tr>
                                                        <tr className="w-fit">
                                                            <td className="font-bold w-44 py-2">
                                                                RNC
                                                            </td>
                                                            <td>{dato.user.rnc}</td>
                                                        </tr>
                                                        <tr className="w-fit">
                                                            <td className="font-bold w-44 py-2">
                                                                Télefono
                                                            </td>
                                                            <td>{dato.user.telefono}</td>
                                                        </tr>
                                                        <tr className="w-fit">
                                                            <td className="font-bold w-44 py-2">
                                                                Correo
                                                            </td>
                                                            <td>{dato.user.email}</td>
                                                        </tr>
                                                    </>
                                                )}
                                                <tr className="w-fit">
                                                    <td className="font-bold w-44 py-2">
                                                        Estatus
                                                    </td>
                                                    <td className="flex gap-2 py-2">
                                                        {dato.status.nombre}
                                                        {auth.user.rol_id != 2 && (<span onClick={() => setIsOpenModalStatus(true)}
                                                            className="cursor-pointer text-blue-600">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                                            </svg>
                                                        </span>)}
                                                    </td>
                                                </tr>
                                                <tr className="w-fit">
                                                    <td className="font-bold w-44 py-2">
                                                        Descripcion
                                                    </td>
                                                    <td>
                                                        <p className="text-justify">{dato.descripcion}</p>
                                                    </td>
                                                </tr>
                                                <tr className="w-fit">
                                                    <td className="font-bold w-44 py-2">
                                                        Usuario Asignado
                                                    </td>
                                                    <td>
                                                        <p className="text-justify">{dato.user_asignado?.name || 'Sin Asignar'}</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>


                                    <div className="flex flex-col w-full border h-92 p-4 py-2 gap-2 rounded-md bg-white">
                                        <span className="font-semibold">Comentarios</span>
                                        <div className="flex flex-col">
                                            {(msj?.error && Array.isArray(msj?.error)) &&
                                                msj.error.map((msj, index) => (
                                                    <h1 key={index} className="flex w-full text-red-400">
                                                        {msj}
                                                    </h1>
                                                ))
                                            }
                                        </div>
                                        {(auth.user.rol_id != 2) &&
                                            <div className="flex justify-between w-full gap-5">
                                                <span className="w-20">Tesoria:</span><input value={comentario} onChange={(e) => setComentario(e.target.value)} type="text" className="h-8 w-full rounded-md" />
                                                <label onClick={() => post(route("comentario.create", { solicitud_id: dato.id, comentario: comentario }))} className="bg-blue-500 px-2 py-1 rounded-lg font-semibold text-white min-w-fit cursor-pointer"> Agregar</label>
                                            </div>}

                                        <div className="flex flex-wrap gap-1">
                                            {dato.comentarios.filter(
                                                (comentario) => (comentario.status == 1)
                                            ).map((comentario) => (
                                                <div key={comentario.id} className="flex gap-3 w-full group ">
                                                    <div className="flex flex-col justify-between">
                                                        <div className="flex flex-col">
                                                            <span className="w-20">Tesoria:</span>
                                                            <span className="hidden text-sm group-hover:block "> {comentario.created_at && format(new Date(comentario.created_at), 'dd/MM/yyyy')}</span>
                                                        </div>
                                                        <span className='hidden  mt-2 group-hover:block cursor-pointer self' onClick={() => post(route("comentario.destroy", { comentario_id: comentario.id }))}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 hover:stroke-red-600">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                            </svg>
                                                        </span>
                                                    </div>
                                                    <span className="overflow-hidden text-ellipsis whitespace-nowrap rounded-md block w-full  group-hover:overflow-visible group-hover:whitespace-normal">
                                                        {comentario.comentario}
                                                    </span>
                                                </div>
                                            ))}

                                        </div>
                                    </div>

                                    <div className="flex flex-col w-full border h-92 p-4 py-2 gap-6 rounded-md bg-white">

                                        <div className="flex justify-between w-full">
                                            <span className="font-semibold">Archivos Subidos</span>
                                            {(dato.status_id < 4 && auth.user.rol_id == 2) &&
                                                <label htmlFor="file" className="bg-upload px-2 py-1 rounded-lg font-semibold text-white"> Agregar + </label>
                                            }
                                        </div>

                                        <div className="flex flex-wrap gap-1">
                                            {dato.files.filter(
                                                (archivo) => (archivo.user.rol_id === 2)
                                            ).map((archivo) => {
                                                const acceso = auth.user.rol_id == 1 || auth.user.id == archivo.user.id;
                                                return (
                                                    <div key={archivo.id} onClick={() => put(archivo.id)} className="text-center w-16 group relative cursor-pointer">
                                                        <div className="w-16 relative">
                                                            <img className="w-full" src={`/assets/svg/${archivo.extencion}.svg`} alt="" onError={(e) => (e.target.src = "/assets/svg/file3.svg")} />

                                                            {archivo.confidencial ? (<img src="/assets/confidencial.png" className={`absolute top-0 ${acceso && "w-1/2"} `} alt="" />) : null}

                                                            {(select == archivo.id && (!archivo.confidencial || acceso)) ? (
                                                                <img onClick={() => handleDownload(archivo)} src="/assets/svg/descargar.svg" alt="" className="z-20 top-10 left-14 w-8 absolute transform -translate-x-1/2 hover:scale-125 " />
                                                            ) : null}

                                                        </div>
                                                        <span className=" left-1/2 transform -translate-x-1/2  relative overflow-hidden text-ellipsis whitespace-nowrap rounded-md block w-16 group-hover:bg-gray-200 group-hover:px-1 group-hover:overflow-visible group-hover:w-fit group-hover:z-10">
                                                            {archivo.nombre}
                                                        </span>

                                                    </div>
                                                )
                                            })}

                                        </div>
                                    </div>

                                    <div className="flex flex-col w-full border h-92 p-4 py-2 gap-6 rounded-md bg-white">

                                        <div className="flex justify-between w-full">
                                            <span className="font-semibold">Entregas</span>

                                            {(auth.user.rol_id != 2) &&
                                                <label htmlFor="file" className="bg-upload px-2 py-1 rounded-lg font-semibold text-white"> Agregar + </label>
                                            }

                                        </div>

                                        <div className="flex flex-wrap gap-1">
                                            {dato.files.filter(
                                                (archivo) => (archivo.user.rol_id != 2)
                                            ).map((archivo) =>
                                            (
                                                <div key={archivo.id} onClick={() => put(archivo.id)} className="text-center w-16 group relative cursor-pointer">
                                                    <div className="w-16 relative">
                                                        <img className="w-full" src={`/assets/svg/${archivo.extencion}.svg`} alt="" onError={(e) => (e.target.src = "/assets/svg/file3.svg")} />

                                                        {select == archivo.id ? (
                                                            <img onClick={() => handleDownload(archivo)} src="/assets/svg/descargar.svg" alt="" className="z-20 top-10 left-14 w-8 absolute transform -translate-x-1/2 hover:scale-125 " />
                                                        ) : null}
                                                    </div>
                                                    <span className=" left-1/2 transform -translate-x-1/2  relative overflow-hidden text-ellipsis whitespace-nowrap rounded-md block w-16 group-hover:bg-gray-200 group-hover:px-1 group-hover:overflow-visible group-hover:w-fit group-hover:z-10">
                                                        {archivo.nombre}
                                                    </span>
                                                </div>
                                            ))}

                                        </div>
                                    </div>



                                    <Modal show={edit} onClose={() => { setShow(false), setEdit(false) }} >
                                        <div className="flex justify-end" >
                                            <button onClick={() => setEdit(false)} className="px-2 font-bold hover:bg-gray-300 rounded-lg">
                                                x
                                            </button>
                                        </div>

                                        <form onSubmit={submit} className="flex flex-col w-full gap-4 text-textgray p-4">

                                            <label htmlFor="nombre" className="text-xs flex flex-col ">
                                                Numero de Solicitud
                                                <input
                                                    disabled
                                                    type="text"
                                                    id="nombre"
                                                    name="nombre"
                                                    value={data.numero}

                                                    className="h-9 rounded-md  outline-none px-2"
                                                />
                                            </label>


                                            <div className="flex gap-4 justify-between ">

                                                <label className="text-xs flex flex-col  w-full">
                                                    Solicitud
                                                    <select
                                                        required
                                                        name="solicitud_id"
                                                        id="solicitud_id"
                                                        value={data.tipo_id}
                                                        onChange={(e) => setData("tipo_id", e.target.value)}
                                                        className="h-9 rounded-md  outline-none px-2"
                                                    >
                                                        <option value="">Seleccione servicio</option>
                                                        {tipoSolicitudes.map((tipo) =>
                                                        (<option key={tipo.id} value={tipo.id}>
                                                            {tipo.nombre}
                                                        </option>)
                                                        )
                                                        }

                                                    </select>
                                                </label>



                                                <label htmlFor="date" className="text-xs flex flex-col max-w-[10rem]">
                                                    Fecha
                                                    <input
                                                        disabled
                                                        type="text"
                                                        id="date"
                                                        name="date"
                                                        value={format(new Date(data.created_at), 'dd/MM/yyyy hh:mm:ss a')}
                                                        className="h-9 rounded-md w-full outline-none px-2"
                                                    />
                                                </label>
                                            </div>

                                            <div className="flex flex-col">
                                                <label htmlFor="descripcion" className="text-xs">
                                                    Descripcion
                                                </label>

                                                <textarea
                                                    value={data.descripcion}

                                                    onChange={(e) => setData("descripcion", e.target.value)}
                                                    placeholder="Escribe tu descripcion"
                                                    name="descripcion"
                                                    id="descripcion"
                                                    className="w-full resize-none h-28 p-3 rounded-md outline-none "
                                                ></textarea>
                                            </div>

                                            <div className="flex flex-col">
                                                {(msj?.error && Array.isArray(msj?.error)) &&
                                                    msj.error.map((msj, index) => (
                                                        <h1 key={index} className="flex w-full text-red-400">
                                                            {msj}
                                                        </h1>
                                                    ))
                                                }
                                            </div>

                                            <button className="border py-1 w-36 rounded-xl bg-gray-300 hover:bg-gray-200 text-textgray self-center justify-center mr-5 mt-5">
                                                Guardar
                                            </button>
                                        </form>

                                    </Modal>

                                </>) : null}
                        </div>

                    </div>
                </div>

            </div>





            <Modal show={show} maxWidth="sm" onClose={() => { setShow(false), setEdit(false) }}>

                <img
                    className="z-50 w-20 absolute left-1/2 transform -translate-x-1/2 -top-10 bg-white rounded-full p-2  "
                    src="/assets/svg/check.svg"
                    alt=""
                />

                <div className="text-center relative mb-2 ">
                    <h1 className="mt-14 mb-8 font-semibold">{msj?.success}</h1>

                    <div className="hover:scale-110">
                        <button onClick={() => { setShow(false), setEdit(false), setIsOpenModalStatus(false) }} className="bg-green-600 rounded-lg px-3 py-1     text-lg font-bold text-white  " >
                            Cerrar
                        </button>

                    </div>

                </div>
            </Modal>

            <Modal show={isOpenModalStatus} maxWidth="sm">

                <div className="flex flex-col items-center gap-5 relative  ">
                    <h1 className="font-semibold text-xl">Cambiar estado de solicitud</h1>

                    <select
                        name="statusSolicitud"
                        id="statusSolicitud"
                        defaultValue={dato?.status.id}
                        onChange={(e) => setData("status_id", e.target.value)}
                        className="w-60 h-9 rounded-md  outline-none"
                    >

                        {statusList.map((tipo) =>
                        (<option key={tipo.id} value={tipo.id}>
                            {tipo.nombre}
                        </option>)
                        )
                        }

                    </select>

                    <div className="flex justify-evenly w-full">
                        <div className="hover:scale-110">
                            <button onClick={() => { setIsOpenModalStatus(false), setEdit(false) }} className="bg-green-600 rounded-lg px-3 py-1     text-lg font-bold text-white  " >
                                Cancelar
                            </button>

                        </div>
                        <div className="hover:scale-110">
                            <button onClick={submit} className="bg-blue-600 rounded-lg px-3 py-1     text-lg font-bold text-white  " >
                                Guardar
                            </button>

                        </div>
                    </div>
                </div>
            </Modal>


        </AuthenticatedLayout>
    );
}
