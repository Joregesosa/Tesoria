import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState, useEffect } from 'react';
import { Head } from "@inertiajs/react";
import jsPDF from 'jspdf';
import { format } from "date-fns";
import Reporte_soli from "./reporte_solicitudes"
import Reporte_doc from "./reporte_documentos"
import { createRoot } from 'react-dom/client';

export default function documentos({ auth, tipo_solicitudes, clientes, estados, empresa }) {



  const solicitudes = auth.user.solicitudes.filter(solicitud => solicitud.tipo_id > 2);


  const documentos = auth.user.solicitudes.flatMap((solicitud) => {
    if (solicitud.files && solicitud.files.length > 0) {
      return solicitud.files.map((documento) => {
        const soli = { ...solicitud };
        delete soli.files;
        documento.solicitud = soli;
        return documento;
      });
    }
    return [];
  });
  
  const [documentos_f, setDocumentos_f] = useState(documentos);
  const [solicitudes_f, setSolicitudes_f] = useState(solicitudes);
  const [reportes, setReportes] = useState(0);
  const [datos, setDatos] = useState({
    inicio: 0,
    fin: 0,
    tipo: 0,
    cliente: 0,
    estado: 0,

    fecha: new Date().toLocaleDateString(),
    hora: new Date().toLocaleTimeString('en-US', { hour12: true }),
    usuario: auth.user.name,

  });

  useEffect(() => {
    console.log(documentos)
    filterDataByDate()
    
  }, [datos])

  const filterDataByDate = () => {

    const inicio = new Date(datos.inicio + ' 00:00:00');
    const fin = new Date(datos.fin + ' 23:59:59');
    console.log(inicio,fin)


    const solicitudes_filtradas = solicitudes.filter((soli) => {

      const fechaCreacion = new Date(soli.created_at);
      if (datos.inicio && fechaCreacion < inicio) {
        return false;
      }

      if (datos.fin && fechaCreacion > fin) {
        return false;
      }
      if (datos.tipo && soli.tipo_id !== datos.tipo) {
        return false;
      }
      if (datos.cliente && soli.user.name !== datos.cliente) {
        return false;
      }

      if (datos.estado && soli.status_id !== datos.estado) {
        return false;
      }

      return true;
    });
    

    const documentos_filtrados = documentos.filter((documento) => {
     

      const fechaCreacion = new Date(documento.created_at);
      console.log({"creacion":fechaCreacion,inicio,"minimo":fechaCreacion > inicio,"fin":fin,"maximco":fechaCreacion < fin})
     
     
      if (datos.inicio && fechaCreacion < inicio) {
        return false;
      }
      if (datos.fin && fechaCreacion > fin) {
        return false;
      }
      if (datos.cliente && documento.user.name !== datos.cliente) {
        return false;
      }


      return true;
    });

    console.log(documentos_filtrados)


    if (reportes == 0) {
      setSolicitudes_f(solicitudes_filtradas);
    } else {
      setDocumentos_f(documentos_filtrados);
    };

 
  };


  const descargarPDF = (reporte) => {

    const pdf = new jsPDF('p', 'pt', 'a4'); // Tamaño de página A4 (595.28 x 841.89 puntos)
    pdf.setFontSize(5);
    const container = document.createElement('div');
    const root = createRoot(container);

    const data = { ...datos, inicio: datos.inicio ? format(new Date(datos.inicio), "dd/MM/yyyy") : "Inicio", fin: datos.fin ? format(new Date(datos.fin), "dd/MM/yyyy") : "Fin" }

    document.body.appendChild(container);
    if (reporte == 0) {
      root.render(<Reporte_soli solicitudes_f={solicitudes_f} datos={data} empresa={empresa} />);

    } else if (reporte == 1) {
      root.render(<Reporte_doc documentos_f={documentos_f} datos={datos} empresa={empresa} />);
    }

    const contentWidth = container.offsetWidth;
    const a4Width = 590; // Ancho de una página A4 en puntos

    const scale = a4Width / contentWidth;

    pdf.html(container, {
      x: 5,
      y: 5,
      html2canvas: { scale: scale },
      callback: function (pdf) {
        pdf.save('report.pdf');
        root.unmount();
        document.body.removeChild(container);
      }
    });


  };


  const descargarExel = () => {

    const data = [{
      ruta: '/reportes/generar/soli',
      nombre: 'reporte_solicitudes.xlsx',
      datos: { ...datos, inicio: datos.inicio ? format(new Date(datos.inicio), "dd/MM/yyyy") : "Inicio", fin: datos.fin ? format(new Date(datos.fin), "dd/MM/yyyy") : "Fin" },
      solicitudes_f: solicitudes_f,
    }, {
      ruta: '/reportes/generar/docu',
      nombre: 'reporte_documentos.xlsx',
      datos: { ...datos, inicio: datos.inicio ? format(new Date(datos.inicio), "dd/MM/yyyy") : "Inicio", fin: datos.fin ? format(new Date(datos.fin), "dd/MM/yyyy") : "Fin" },
      documentos_f: documentos_f,
    }
    ]


    axios
      .post(data[reportes].ruta, { data: data[reportes] }, { responseType: 'blob' })
      .then((response) => {
       
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', data[reportes].nombre);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.error('Error al descargar el archivo:', error);
      });
  };

  return (
    <AuthenticatedLayout
      countNotificaciones={auth.countNotificaciones}
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Reportes</h2>}
    >
      <>
        <Head title="Reportes" />
        <div className='mx-10 mt-3'>


          <div className='flex text-black '>
            <button onClick={() => setReportes(0)}
              className={` rounded-t-2xl cursor-pointer flex items-center gap-2 h-10 p-2 bg-gray-300  ${reportes == 0 ? "bg-white " : ""
                }  font-semibold text-base `}>
              <img src="/assets/svg/export2.svg" width={30} height={30} alt="icon documento" />
              Solicitudes
            </button>

            <button
              onClick={() => setReportes(1)}
              className={`rounded-t-2xl cursor-pointer flex items-center gap-2 h-10 p-2 bg-gray-300 ${reportes == 1 ? "bg-white " : ""
                }  font-semibold text-base `}>
              <img src="/assets/svg/document2.svg" width={30} height={30} alt="icon documento" />
              Documentos
            </button>
          </div>

          <div className='rounded-tl-none mb-4 bg-white p-4 rounded-lg shadow-md'>



            <div className='flex gap-8 my-3'>

              <label className=" flex flex-col " >
                <span className='font-semibold'>Fecha de inicio</span>
                <input max={datos.fin} className='p-0 px-2 rounded-md w-52 h-8' type="date" value={datos.inicio} onChange={(e) => setDatos({ ...datos, inicio: e.target.value })} />
              </label>

              <label className="flex flex-col " >
                <span className='font-semibold'>Fecha de fin</span>

                <input min={datos.inicio} className='p-0 px-2 rounded-md w-52 h-8' type="date" value={datos.fin} onChange={(e) => setDatos({ ...datos, fin: e.target.value })} />
              </label>

              <label className="flex  flex-col"  >

                <span className='font-semibold'>Cliente:</span>

                <select
                  required
                  value={datos.cliente}
                  onChange={(e) => setDatos({ ...datos, cliente: e.target.value })}
                  name="cliente"
                  id="cliente"
                  className="p-0 px-2 pe-6 w-fit min-w-[13rem] rounded-md  h-8"
                >
                  <option value={''} select>Todos</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.name}>
                      {cliente.name}
                    </option>
                  ))}
                </select>
              </label>


            </div>


            {reportes == 0 && (
              <div className='flex gap-8'>
                <label className="flex  flex-col "  >
                  <span className='font-semibold'> Tipo Solicitudes:</span>

                  <select
                    required
                    value={datos.tipo}
                    onChange={(e) => setDatos({ ...datos, tipo: parseInt(e.target.value) })}
                    name="tipo_id"
                    id="tipo_id"
                    className="p-0 px-2 w-fit rounded-md h-8"
                  >
                    <option value={0} select>Todas</option>
                    {tipo_solicitudes.map((solicitud) => (
                      <option key={solicitud.id} value={solicitud.id}>
                        {solicitud.nombre}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex  flex-col"  >

                  <span className='font-semibold'>Estados:</span>

                  <select
                    required
                    value={datos.estado}
                    onChange={(e) => setDatos({ ...datos, estado: parseInt(e.target.value) })}
                    name="estado"
                    id="estado"
                    className="p-0 px-2 pe-6 w-fit min-w-[13rem] rounded-md  h-8"
                  >
                    <option value={''} select>Todos</option>
                    {estados.map((estado) => (
                      <option key={estado.id} value={estado.id}>
                        {estado.nombre}
                      </option>
                    ))}
                  </select>
                </label>


              </div>

            )}




          </div>




          {reportes == 0 ? (<div >


            <div id='contenido' className=''>
              <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                  <div className='bg-white w-full px-3 py-2'>
                    <div className=' flex items-center gap-3 font-bold '>
                      <span>Exportar</span>
                      <button className='hover:scale-125' onClick={() => descargarPDF(reportes)}>
                        <img src="/assets/svg/pdf.svg" width={30} height={30} alt="icon documento" />
                      </button>

                      <button className='hover:scale-125' onClick={() => descargarExel()}>
                        <img src="/assets/svg/xlsx.svg" width={30} height={30} alt="icon documento" />
                      </button>
                    </div>
                  </div>
                  <table className="min-w-full leading-normal overflow-hidden">

                    <thead >

                      <tr>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          # Solicitud
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Cliente
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          RNC
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          CORREO
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {solicitudes_f && (
                        solicitudes_f.map((user, i) => (
                          <tr key={i}>

                            <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                              <p className="text-gray-900 whitespace-no-wrap">{user.numero}</p>
                            </td>
                            <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                              <p className="text-gray-900 whitespace-no-wrap">{user.tipo.nombre}</p>
                            </td>
                            <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                              <p className="text-gray-900 whitespace-no-wrap">{user.user.name}</p>
                            </td>
                            <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                              <p className="text-gray-900 whitespace-no-wrap">{user.user.rnc}</p>
                            </td>
                            <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                              <p className="text-gray-900 whitespace-no-wrap">{format(new Date(user.created_at), "dd/MM/yyyy hh:mm:ss a")}</p>
                            </td>
                            <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                              <p className="text-gray-900 whitespace-no-wrap">{user.status.nombre}</p>
                            </td>
                            <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                              <p className="text-gray-900 whitespace-no-wrap">{user.user.email}</p>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>) : (<div >


            <div id='contenido' className=''>

              <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">

                  <div className='bg-white w-full px-3 py-2'>
                    <div className=' flex items-center gap-3 font-bold '>
                      <span>Exportar</span>
                      <button className='hover:scale-125' onClick={() => descargarPDF(reportes)}>
                        <img src="/assets/svg/pdf.svg" width={30} height={30} alt="icon documento" />
                      </button>

                      <button className='hover:scale-125' onClick={() => descargarExel()}>
                        <img src="/assets/svg/xlsx.svg" width={30} height={30} alt="icon documento" />
                      </button>
                    </div>
                  </div>

                  <table className="min-w-full leading-normal overflow-hidden">
                    <thead>
                      <tr>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Nombre
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Tipo Documento
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                           # solicitud            
                              </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Tipo Solicitud
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Usuario
                        </th>

                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Fecha
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {documentos_f && (
                        documentos_f.map((documento, i) => (
                          <tr key={i}>
                            <td className="px-5 py-3 border-b border-gray-200 bg-white text-base font-medium">
                              {documento.id}
                            </td>
                            <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                              <p className="text-gray-900 whitespace-no-wrap">{documento.nombre}</p>
                            </td>
                            <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                              <p className="text-gray-900 whitespace-no-wrap">{documento.extencion}</p>
                            </td>
                            <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                              <p className="text-gray-900 whitespace-no-wrap">{documento.solicitud.numero}</p>
                            </td>
                            <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                              <p className="text-gray-900 whitespace-no-wrap">{documento.solicitud.tipo.nombre}</p>
                            </td>
                            <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                              <p className="text-gray-900 whitespace-no-wrap">{documento.user.name}</p>
                            </td>
                            <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                              <p className="text-gray-900 whitespace-no-wrap">{documento.created_at && format(new Date(documento.created_at), "dd/MM/yyyy hh:mm:ss a")}</p>
                            </td>

                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>)}



        </div>
      </>
    </AuthenticatedLayout>
  );
}
