import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useEffect, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import { DeleteAlert } from '@/Components/DeleteAlert';
import Loading from '@/Components/Loading';
import { format, set } from "date-fns";

export default function Panel({ auth, msj, clientes }) {
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(0);
    const [showEdit, setShowEdit] = useState(0);
    const solicitudes = auth.user.solicitudes.filter(solicitud => solicitud.tipo_id < 3);


    solicitudes.sort((a, b) => {
        return new Date(a.created_at) - new Date(b.created_at);
    });

    const [opencliente, setOpenCliente] = useState(auth.user);

    const datos_f = solicitudes.reduce((solicitudesPorTipo, solicitud) => {
        const year = new Date(solicitud.created_at).getFullYear();

        if (solicitud.tipo_id === 1 && solicitud.user_id == opencliente?.id) {

            solicitudesPorTipo.tipo1[year] = solicitudesPorTipo.tipo1[year] || [];
            solicitudesPorTipo.tipo1[year].push(solicitud);
        } else if (solicitud.tipo_id === 2 && solicitud.user_id == opencliente?.id) {

            solicitudesPorTipo.tipo2[year] = solicitudesPorTipo.tipo2[year] || [];
            solicitudesPorTipo.tipo2[year].push(solicitud);
        }

        return solicitudesPorTipo;
    }, { tipo1: {}, tipo2: {} });



    const [Message, setMessage] = useState(null);
    const [show, setShow] = useState(false);
    const [showmsj, setShowmsj] = useState(msj != null);
    const [select, setSelet] = useState(0);
    const [openyear, setOpenyear] = useState(0);
    const [openmonth, setOpenmonth] = useState(0);

    const { data, setData, post, processing, errors, reset } = useForm({
        tipo_id: 0,
        descripcion: "",
        created_at: "",
        year: new Date().getFullYear().toString(),
        month: (new Date().getMonth()+1).toString(),
        status: 1,
    });

    const cliente = (id) => {
        const clienteseleccionado = clientes.find(
            (cliente) => cliente.id == id
        );
        setOpenCliente(clienteseleccionado)
    };

    const getYearList = () => {
        let date = new Date();
        let year = date.getFullYear() - 2

        let years = [];
        for (let i = 0; i < 5; i++) {

            years.push(year + i)

        }

        return years
    }

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

    useEffect(() => {
        console.log(msj)
        if (msj && msj.errord) {
            setMessage("Ya existe un bloque para este mes del " + data.year);
        } else if (msj && msj.error && typeof msj.error === "string") {
            setMessage(msj.error);
            if(!show) alert(msj.error)
         } else if (msj && !msj.error) {
            setShowEdit(0)
            setMessage(msj.success);
            setShowmsj(true);
            setData("month", "")
        }
    }, [msj]);


    function submit(e) {
        e.preventDefault();

        console.log(data)

        setLoading(true);
        post(route('solicitud.create', showAlert), {
            onSuccess: () => {

                setLoading(false);
            }
        });

    }

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];


    useEffect(() => {
        setData({
            ...data,
            descripcion: monthNames[data.month - 1] + " " + data.year,
            created_at: data.year + "-" + data.month + "-02",
        });
    }, [data.month]);


    const abrir = (year) => {
        if (openyear == year) {
            setOpenyear(0);

        } else {
            setOpenyear(year);
        }
        setOpenmonth(0);
    };

    function destroy() {

        setLoading(true);
        post(route('solicitud.destroy', showAlert), {
            onSuccess: () => {
                setShowAlert(0)
                setLoading(false);
            }
        });

    }

    function edit(e) {
        e.preventDefault();

        setLoading(true);
        post(route('solicitud.update', { id: showEdit.id }), {
            onSuccess: () => {
               
                setLoading(false);
            }
        });

    }


    function setDefaultEditData(solicitud_) {

        setData({
            ...data,
            'month': format(new Date(solicitud_.created_at), "MM"),
            'year': format(new Date(solicitud_.created_at), "yyyy"),
            'tipo_id': solicitud_.tipo_id
        })

        setShowEdit(solicitud_);
    };



    return (
        <AuthenticatedLayout
            solicitud_id={openmonth}
            msj={msj}
            countNotificaciones={auth.countNotificaciones}
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Panel de documentos</h2>}
        >
            <Head title="Panel" />

            <div className='pb-1'>
                <div className='bg-white shadow-md h-full mx-5 rounded-md p-5 md:p-2 mt-3 mb-3'>

                    {(auth.user.rol_id != 2) ?
                        (
                            <label className='flex  w-full flex-wrap mb-3 md:m-6 items-center'>
                                <span className='flex items-center whitespace-nowrap  w-fit  h-12 px-2'>Seleccione un cliente</span>
                                <select
                                    value={opencliente?.id}
                                    onChange={(e) => cliente(e.target.value)}
                                    className=" w-fit min-w-[5rem]  rounded-md  h-12   outline-none px-2"
                                >
                                    <option value="0">Seleccione el cliente</option>

                                    {clientes?.map((cliente) =>
                                        <option key={cliente.id} value={cliente.id}>
                                            {cliente.name} - {cliente.email}
                                        </option>)
                                    }
                                </select>
                            </label>

                        ) : (null)}


                    {(opencliente?.rol_id == 2 && auth.user.rol_id != 2) ?
                        (<div className='  md:m-6 mt-0 border-2 w-full md:w-fit border-black rounded-md p-1  flex gap-2 flex-col md:flex-row'>

                            <div>
                                <div className="flex items-center justify-between px-2 md:p-0 md:justify-start ">
                                    <div className="font-bold w-44 py-2">Nombre solicitante</div>
                                    <div>{opencliente.name}</div>
                                </div>

                                <div className="flex items-center justify-between px-2 md:p-0 md:justify-start">
                                    <div className="font-bold w-44 py-2">Nombre empresa</div>
                                    <div>{opencliente.empresa}</div>

                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between px-2 md:p-0 md:justify-start">
                                    <div className="font-bold w-44 py-2">Télefono</div>
                                    <div>{opencliente.telefono}</div>
                                </div>

                                <div className="flex items-center justify-between px-2 md:p-0 md:justify-start">
                                    <div className="font-bold w-44 py-2">RNC</div>
                                    <div>{opencliente.rnc}</div>
                                </div>
                            </div>
                            <tr className="w-fit">
                            </tr>

                            <tr className="w-fit">
                            </tr>

                        </div>) : (null)}



                    <div className="w-full md:w-[calc(100%-3rem)] h-[calc(100%-3rem)] flex flex-col md:flex-row gap-4 my-3 md:m-6 rounded-md  mb-2">

                        <div className="h-full w-full bg-[#f2f2f2]">
                          
                            <h3 className="w-full bg-[#1ec0e6] p-2 font-bold text-white rounded-t-md text-xl flex justify-between">Facturas de costos/gastos
                                {(auth.user.rol_id == 2) ? (<button htmlFor="file" onClick={() => { setShow(true);reset(), setData("tipo_id", 1); }} className='flex h-9 px-2 gap-2 bg-upload items-center rounded-lg text-base text-white cursor-pointer'>
                                    Crear Bloque +
                                </button>) : (

                                    <h1 className='h-9 px-2 gap-2  items-center '></h1>
                                )}

                            </h3>
                                    
                            <div className="flex flex-col h-5/6 overflow-hidden ">
                                {Object.keys(datos_f.tipo1).sort((a, b) => {
                                    return new Date(b) - new Date(a);
                                }).map((year, index) => (
                                    <table key={"t1" + index} className="w-full text-left text-textgray">
                                        <thead onClick={() => abrir("1" + year)}>
                                            <tr className="border-2 text-sm h-8 bg-gray-300">
                                                <th className="p-2">Facturas {year} </th>
                                            </tr>
                                        </thead>

                                        <div key={"t1" + year} className={`block overflow-auto duration-500  transition-all ${openyear == "1" + year ? 'h-[400px]' : "h-0"}  `}>
                                            {datos_f.tipo1[year].map((solicitud, index) => (
                                                <div key={solicitud.id}>
                                                    <div onClick={() => setOpenmonth(solicitud.id)} className='cursor-pointer flex justify-between'>
                                                        <div className="p-2 h-10">{solicitud.descripcion} ({solicitud.files?.length})</div>
                                                        <div className='flex items-center'>
                                                            {auth.user.rol_id == 2 && (<div className="p-2 h-10"><label htmlFor="file" className="bg-upload px-2 pb-1 rounded-lg font-semibold text-white"> + </label></div>)}

                                                            {auth.user.rol_id == 1 && (
                                                                <div className="p-2 h-10" onClick={() => { setDefaultEditData(solicitud) }}>
                                                                    <svg className="w-7 h-7  text-cyan-600 hover:text-blue-600">
                                                                        <use xlinkHref={"/assets/svg/editar.svg" + '#editar'} />
                                                                    </svg>

                                                                </div>)}

                                                            {(auth.user.rol_id == 1 || (auth.user.rol_id == 2 && solicitud.files.length === 0)) && (
                                                                <div className="p-2 h-10" onClick={() => setShowAlert(solicitud)}>

                                                                    <svg className="w-7 h-7 text-blue-400 hover:text-red-600">
                                                                        <use xlinkHref={"/assets/svg/delete.svg" + '#delete'} />
                                                                    </svg>

                                                                </div>
                                                            )}

                                                        </div>
                                                    </div>

                                                    <div className={` bg-white ms-5 rounded-sm p-1 flex duration-1000 transition-all ${openmonth == solicitud.id ? `` : "hidden "}`}>
                                                        {solicitud.files ? (
                                                            solicitud.files.map((archivo) => {
                                                                const acceso = auth.user.rol_id == 1 || auth.user.id == archivo.user.id;
                                                                return (
                                                                    <div key={archivo.id} onClick={() => put(archivo.id)} className="text-center w-16 group relative cursor-pointer">
                                                                        <div className="w-12 relative">
                                                                            <img className="w-full" src={`/assets/svg/${archivo.extencion}.svg`} alt="" onError={(e) => (e.target.src = "/assets/svg/file3.svg")} />

                                                                            {archivo.confidencial ? (<img src="/assets/confidencial.png" className={`absolute top-0 ${acceso && "w-1/2"} `} alt="" />) : null}

                                                                            {(select == archivo.id && (!archivo.confidencial || acceso)) ? (
                                                                                <img onClick={() => handleDownload(archivo)} src="/assets/svg/descargar.svg" alt="" className="z-20 top-10 left-14 w-8 absolute transform -translate-x-1/2 hover:scale-125 " />
                                                                            ) : null}

                                                                        </div>
                                                                        <span className="text-sm left-1/2 transform -translate-x-1/2  relative overflow-hidden text-ellipsis whitespace-nowrap rounded-md block w-16 group-hover:bg-gray-200 group-hover:px-1 group-hover:overflow-visible group-hover:w-fit group-hover:z-10">
                                                                            {archivo.nombre}
                                                                        </span>

                                                                    </div>
                                                                )
                                                            })
                                                        ) : <div>No hay facturas subidas</div>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </table>
                                )

                                )}

                            </div>
                        </div>

                        <div className="h-full w-full bg-[#f2f2f2]">
                            <h3 className="w-full bg-[#1e85e6] p-2 font-bold text-white rounded-t-md text-xl flex justify-between">Facturas de Ventas
                                {(auth.user.rol_id == 2) ? (<button htmlFor="file" onClick={() => { setShow(true); reset();setData("tipo_id", 2);}} className='flex h-9 px-2 gap-2 bg-upload items-center rounded-lg text-base text-white cursor-pointer'>
                                    Crear Bloque +

                                </button>) : (

                                    <h1 className='h-9 px-2 gap-2  items-center '></h1>
                                )}

                            </h3>

                            <div className="flex flex-col h-5/6 overflow-hidden ">
                                {Object.keys(datos_f.tipo2).sort((a, b) => {
                                    return new Date(b) - new Date(a);
                                }).map((year, index) => {

                                    return (
                                        <table key={"t2" + index} className="w-full text-left text-textgray">
                                            <thead onClick={() => abrir("2" + year)}>
                                                <tr className="border-2 text-sm h-8 bg-gray-300">
                                                    <th className="p-2">Facturas {year} </th>
                                                </tr>
                                            </thead>

                                            <div key={"tb2" + year} className={`block overflow-auto duration-500  transition-all ${openyear == "2" + year ? 'h-[400px]' : "h-0"}  `}>

                                                {datos_f.tipo2[year].map((solicitud) => (
                                                    <div key={solicitud.id} >
                                                        <div onClick={() => setOpenmonth(solicitud.id)} className='cursor-pointer flex justify-between'>

                                                            <div className="p-2 h-10">{solicitud.descripcion} ({solicitud.files?.length})</div>

                                                            <div className='flex items-center'>
                                                                {auth.user.rol_id == 2 && (<div className="p-2 h-10"><label htmlFor="file" className="bg-upload px-2 pb-1 rounded-lg font-semibold text-white"> + </label></div>)}

                                                                {auth.user.rol_id == 2 && (
                                                                    <div className="p-2 h-10" onClick={() => { setDefaultEditData(solicitud) }}>
                                                                        <svg className="w-7 h-7  text-cyan-600 hover:text-blue-600">
                                                                            <use xlinkHref={"/assets/svg/editar.svg" + '#editar'} />
                                                                        </svg>

                                                                    </div>)}

                                                                {(auth.user.rol_id == 1 || (auth.user.rol_id == 2 && solicitud.files.length === 0)) && (
                                                                    <div className="p-2 h-10" onClick={() => setShowAlert(solicitud)}>

                                                                        <svg className="w-7 h-7 text-blue-400 hover:text-red-600">
                                                                            <use xlinkHref={"/assets/svg/delete.svg" + '#delete'} />
                                                                        </svg>

                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className={` bg-white ms-5 rounded-sm p-1 flex duration-1000 transition-all ${openmonth == solicitud.id ? `` : "hidden "}`}>

                                                            {solicitud.files ? (
                                                                solicitud.files.map((archivo) => {
                                                                    const acceso = auth.user.rol_id == 1 || auth.user.id == archivo.user.id;
                                                                    return (
                                                                        <div key={archivo.id} onClick={() => put(archivo.id)} className="text-center w-16 group relative cursor-pointer">
                                                                            <div className="w-12 relative">
                                                                                <img className="w-full" src={`/assets/svg/${archivo.extencion}.svg`} alt="" onError={(e) => (e.target.src = "/assets/svg/file3.svg")} />

                                                                                {archivo.confidencial ? (<img src="/assets/confidencial.png" className={`absolute top-0 ${acceso && "w-1/2"} `} alt="" />) : null}

                                                                                {(select == archivo.id && (!archivo.confidencial || acceso)) ? (
                                                                                    <img onClick={() => handleDownload(archivo)} src="/assets/svg/descargar.svg" alt="" className="z-20 top-10 left-14 w-8 absolute transform -translate-x-1/2 hover:scale-125 " />
                                                                                ) : null}

                                                                            </div>
                                                                            <span className="text-sm left-1/2 transform -translate-x-1/2  relative overflow-hidden text-ellipsis whitespace-nowrap rounded-md block w-16 group-hover:bg-gray-200 group-hover:px-1 group-hover:overflow-visible group-hover:w-fit group-hover:z-10">
                                                                                {archivo.nombre}
                                                                            </span>

                                                                        </div>
                                                                    )
                                                                })
                                                            ) : <div>No hay facturas subidas</div>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </table>)
                                }


                                )}

                            </div>
                        </div>

                    </div>
                </div>

            </div>

            <Modal show={show} onClose={() => { setShow(false); setMessage(null) }} maxWidth={"md"} >
                <div className="flex justify-end" >
                    <button onClick={() => { setShow(false); setMessage(null) }} className="px-2 font-bold hover:bg-gray-300 rounded-lg">
                        x
                    </button>
                </div>

                <form onSubmit={submit} className="flex flex-col w-full  text-textgray ">
                    <h1 className='text-xl text-center font-bold'>Bloque Para facturas</h1>
                    <h1 className='text-xl text-center font-bold mb-5'>{data.tipo_id == 1 ? "Compras" : "ventas"}</h1>
                    <div className='flex gap-4'>

                        <label className="text-base flex flex-col w-2/3">
                            <span className='whitespace-nowrap'>Seleccione el mes </span>

                            <select
                                required
                                name="month"
                                id="month"
                                value={data.month}
                                onChange={(e) => setData("month", e.target.value)}
                                className="h-9 rounded-md outline-none px-2"
                            >
                                <option value="" disabled></option>
                                <option value="01">Enero</option>
                                <option value="02">Febrero</option>
                                <option value="03">Marzo</option>
                                <option value="04">Abril</option>
                                <option value="05">Mayo</option>
                                <option value="06">Junio</option>
                                <option value="07">Julio</option>
                                <option value="08">Agosto</option>
                                <option value="09">Septiembre</option>
                                <option value="10">Octubre</option>
                                <option value="11">Noviembre</option>
                                <option value="12">Diciembre</option>
                            </select>

                        </label>

                        <label className="text-base flex flex-col w-fit">
                            <span className='whitespace-nowrap'>Seleccione el Año </span>
                            <select
                                required
                                name="year"
                                id="year"
                                value={data.year}
                                onChange={(e) => setData("year", e.target.value)}
                                className="h-9  rounded-md outline-none px-2"
                            >
                                <option value="" disabled></option>
                                {getYearList().map(year =>
                                    <option key={year} value={year}>{year}</option>

                                )}

                            </select>
                        </label>
                    </div>

                    {Message && (
                        <div className="text-red-500">
                            {Message}
                        </div>
                    )}

                    <button className={`border py-1 w-36 rounded-xl ${data.tipo_id == 1 ? "bg-[#1ec0e6]" : "bg-[#1e85e6]"}  hover:bg-gray-300 text-white self-center hover:text-gray-800 justify-center mr-5 mt-8`}>
                        Crear
                    </button>
                </form>

            </Modal>

            <Modal show={showEdit != 0} onClose={() => { setShowEdit(0); setMessage(null) }} maxWidth={"md"} >
                <div className="flex justify-end" >
                    <button onClick={() => { setShowEdit(0); setMessage(null) }} className="px-2 font-bold hover:bg-gray-300 rounded-lg">
                        x
                    </button>
                </div>

                <form onSubmit={edit} className="flex flex-col w-full  text-textgray ">
                    <h1 className='text-xl text-center font-bold'>Bloque Para facturas</h1>
                    <h1 className='text-xl text-center font-bold mb-5'>{data.tipo_id == 1 ? "Compras" : "ventas"}</h1>
                    <div className='flex gap-4'>

                        <label className="text-base flex flex-col w-2/3">
                            <span className='whitespace-nowrap'>Seleccione el mes </span>

                            <select
                                required
                                name="month"
                                id="month"
                                value={data.month}
                                onChange={(e) => setData("month", e.target.value)}
                                className="h-9 rounded-md outline-none px-2"

                            >
                                {/* <option value="" disabled></option> */}
                                <option value="01">Enero</option>
                                <option value="02">Febrero</option>
                                <option value="03">Marzo</option>
                                <option value="04">Abril</option>
                                <option value="05">Mayo</option>
                                <option value="06">Junio</option>
                                <option value="07">Julio</option>
                                <option value="08">Agosto</option>
                                <option value="09">Septiembre</option>
                                <option value="10">Octubre</option>
                                <option value="11">Noviembre</option>
                                <option value="12">Diciembre</option>
                            </select>

                        </label>

                        <label className="text-base flex flex-col w-fit">
                            <span className='whitespace-nowrap'>Seleccione el Año </span>
                            <select
                                required
                                name="year"
                                id="year"
                                value={data.year}
                                onChange={(e) => setData("year", e.target.value)}
                                className="h-9  rounded-md outline-none px-2"
                            >
                                <option value="" disabled></option>
                                {getYearList().map(year =>
                                    <option key={year} value={year}>{year}</option>

                                )}

                            </select>
                        </label>
                    </div>

                    {Message && (
                        <div className="text-red-500">
                            {Message}
                        </div>
                    )}

                    <button type='submit' className={`border py-1 w-36 rounded-xl ${data.tipo_id == 1 ? "bg-[#1ec0e6]" : "bg-[#1e85e6]"}  hover:bg-gray-300 text-white hover:text-gray-800 self-center justify-center mr-5 mt-8`}>
                        Guardar
                    </button>
                </form>

            </Modal>

            <Modal show={showmsj} maxWidth="sm" onClose={() => { setShowmsj(false); setMessage(null) }} >
                <img
                    className="z-50 w-20 absolute left-1/2 transform -translate-x-1/2 -top-10 bg-white rounded-full p-2  "
                    src="/assets/svg/check.svg"
                    alt=""
                />

                <div className="text-center relative mb-2 ">
                    <h1 className="mt-14 mb-8 font-semibold">{Message}</h1>

                    <div className="hover:scale-110">
                        <button onClick={() => { setShowmsj(false); setMessage(null) }} className="bg-green-600 rounded-lg px-3 py-1     text-lg font-bold text-white  " >
                            Cerrar
                        </button>

                    </div>

                </div>
            </Modal>

            <DeleteAlert
                show={showAlert != 0}
                title={showAlert?.descripcion}
                hideModal={() => setShowAlert(0)}
                destroy={() => destroy()}
            />
            <Modal show={loading}>
                <Loading />
            </Modal>
        </AuthenticatedLayout>

    )

}
