import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useEffect, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import React from "react";

export default function Solicitudes({ auth, datos, msj }) {

    const [solicitudes, setSolicitudes] = useState(datos);
    const [show, setShow] = useState(msj != null);
    useEffect(() => {
        console.log(msj)
        setShow(msj?.success != undefined);
        
    }, [msj]);

    const [esTipo, setEsTipo] = useState(0);
    const { data, setData, post, processing, errors, reset } = useForm({
        tipo_id: "",
        descripcion: "",
    });

    const filtrarPorTipo = (tipo) => {
        if (esTipo == tipo) {
            setEsTipo(0);
            setSolicitudes(datos);
        } else {
            setEsTipo(tipo);
            const solicitudesFiltradas = datos.filter(
                (item) => item.tipo === tipo
            );
            setSolicitudes(solicitudesFiltradas);
        }
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("solicitud.create"));

    };

    const rediret = () => {
        window.location.reload();

    };

    return (
        <AuthenticatedLayout
            countNotificaciones={auth.countNotificaciones}
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Solicitudes
                </h2>
            }
        >
            <Head title="Solicitudes" />

            <Modal show={show} maxWidth="sm" onClose={rediret}>
                <img
                    className="z-50 w-20 absolute left-1/2 transform -translate-x-1/2 -top-10 bg-white rounded-full p-2  "
                    src="/assets/svg/check.svg"
                    alt=""
                />

                <div className="text-center relative mb-2 ">
                    <h1 className="mt-14 mb-8 font-semibold">{msj?.success || msj?.error}</h1>
                    {msj?.success && (
                         <div className="hover:scale-110">
                        <Link href={route("admsolicitudes", { id: msj.id })} className="bg-green-600 rounded-lg px-3 py-1     text-lg font-bold text-white  " >
                            Ver
                        </Link>
                    </div>)}
                   

                </div>
            </Modal>
            <div className=" pb-1  ">
            <div className="w-[calc(100%-3rem)] h-[calc(100%-3rem)] bg-[#f2f2f2] m-6 rounded-md flex flex-col gap-10 py-4">
               
              

                <ul className="grid grid-cols-1 min-[555px]:grid-cols-2  lg:grid-cols-4 md:p-6 w-fit mx-auto">

                    <li
                        onClick={() => filtrarPorTipo(1)}

                        className={`cursor-pointer flex items-center gap-3 p-1 md:p-3 m-2 w-11/12 h-14 md:h-20 border-2 transition-all duration-500 bg-blue-500 ${esTipo == 1 ? "scale-75 border-black" : ""
                            } rounded-md text-white font-semibold text-[80%] md:text-lg `}

                    >
                        <img
                            src="/assets/svg/export.svg"
                            width={40}
                            height={40}
                            alt="Servicios"
                        />
                        Servicios
                    </li>

                    <li
                        onClick={() => filtrarPorTipo(2)}

                        className={` cursor-pointer flex items-center gap-3 p-1 md:p-3 m-2 w-11/12 h-14 md:h-20 border-2 bg-[#EAB308] transition-all duration-500 ${esTipo == 2 ? "scale-75 border-black" : ""
                            } rounded-md text-white font-semibold text-[80%] md:text-lg `}

                    >
                        <img
                            src="/assets/svg/document.svg"
                            width={40}
                            height={40}
                            alt="icon documento"
                        />
                        Certificaciones
                    </li>

                    <li
                        onClick={() => filtrarPorTipo(3)}

                        className={`cursor-pointer flex items-center gap-3 p-1 md:p-3 m-2 w-11/12 h-14 md:h-20 border-2 bg-cyan-500 transition-all duration-500 ${esTipo == 3 ? "scale-75 border-black" : ""
                            } rounded-md text-white font-semibold text-[80%] md:text-lg filter`}

                    >
                        <img
                            src="/assets/svg/board.svg"
                            width={40}
                            height={40}
                            alt="Icon board"
                        />
                        Estados Financieros
                    </li>

                    <li
                        onClick={() => filtrarPorTipo(4)}

                        className={`cursor-pointer flex items-center gap-3 p-1 md:p-3 m-2 w-11/12 h-14 md:h-20 border-2 bg-blue-800 transition-all duration-500 ${esTipo == 4 ? "scale-75 border-black" : ""
                            } rounded-md text-white font-semibold text-[80%] md:text-lg`}

                    >
                        <img
                            src="/assets/svg/database.svg"
                            width={40}
                            height={40}
                            alt="icon database"
                        />
                        Reportes Generales
                    </li>
                </ul>

                <form
                    onSubmit={submit}
                    className="flex flex-col mx-8 md:mx-24   gap-4 text-textgray"
                >
                    <label className="flex flex-wrap items-center gap-3"  >
                        <span className=" text-xl w-48 "> Seleccione servicio</span>
                        <select
                            required
                            value={data.tipo_id}
                            onChange={(e) => setData("tipo_id", e.target.value)}
                            name="tipo_id"
                            id="tipo_id"
                            className=" p-3 w-full max-w-[30rem] bg-white rounded-md outline-none"
                        >
                            <option defaultValue={""}>Ningun sercicio seleccionado</option>
                            {solicitudes.map((solicitud) => (
                                <option key={solicitud.id} value={solicitud.id}>
                                    {solicitud.nombre}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className="flex flex-col">
                        <label htmlFor="descripcion" className=" text-xl" >Favor detalle su solicitud:</label>

                        <textarea
                            required
                            placeholder="Escribe tu descripcion"
                            name="descripcion"
                            id="descripcion"
                            value={data.descripcion}
                            onChange={(e) =>
                                setData("descripcion", e.target.value)
                            }
                            className="w-full resize-none h-44 p-3 outline-none mt-2"
                        ></textarea>
                    </div>
                            <div className="text-red-500">
                    {msj?.error ?? ( <div >{msj?.error}</div>)}

                            </div>
                   
                    <button className="border py-1 w-36 rounded-xl bg-gray-300 hover:bg-gray-200 text-textgray self-center  md:self-end justify-end mr-5 mt-5">
                        Enviar solicitud
                    </button>
                </form>
            </div>
                            </div>

        </AuthenticatedLayout>
    );
}
