import { format } from "date-fns";

export default function Reporte({ documentos_f, datos,empresa }) {



  function formato_0(id, longitud) {
    const idString = id.toString();
    const cerosFaltantes = longitud - idString.length;

    if (cerosFaltantes <= 0) {
      return idString;
    }

    const ceros = '0'.repeat(cerosFaltantes);
    return ceros + idString;
  }


  return (
    <div className="mx-10 bg-white p-5 rounded shadow-lg">
      {/* header */}
      <div className="text-center mb-10 relative w-full">
        <img src="./assets/colorfullLogo.png" alt="Logo" className="w-1/6 absolute top-0 left-0" />
        <h1 className="text-2xl mt-3 [word-spacing:10px]" > {empresa?.empresa}  </h1>
        <h2>{empresa?.direccion} </h2>
        <h2>RNC : {empresa?.RNC} &nbsp;&nbsp;Tel.: {empresa?.telefono} {empresa?.telefono2 != '' && ` | ${empresa?.telefono2}`}</h2>
      </div>

      <table className="min-w-full w-full leading-normal overflow-hidden  text-lg">
        <tbody className=" block w-full pb-5" >


          <tr className="w-full flex " >
            <td className="flex w-1/2">
              <h1 className="w-20  font-medium ">Reporte:</h1>
              SOL00456
            </td>
            <td className="flex w-1/2">
              <h1 className="w-20  font-medium">Usuario:</h1>
              {datos?.usuario}
            </td>
          </tr>

          <tr className="w-full flex" >
            <td className="flex w-1/2">
              <h1 className="w-20  font-medium ">Fecha:</h1>
              {datos?.inicio || "Inicio"}
            </td>
            <td className="flex w-1/2">
              <h1 className="w-20  font-medium">Fecha :</h1>
              {datos?.fecha}
            </td>
          </tr>

          <tr className="w-full flex" >
            <td className="flex w-1/2">
              <h1 className="w-20  font-medium ">Hasta:</h1>
              {datos?.fin || "Actual"}
            </td>
            <td className="flex w-1/2">
              <h1 className="w-20  font-medium">Hora:</h1>
              {datos?.hora}
            </td>
          </tr>

          {datos?.cliente ? (

            <tr className="w-full flex" >
              <td className="flex w-1/2">
                <h1 className="w-20  font-medium ">Cliente:</h1>
                {documentos_f[0].user.name}
              </td>

            </tr>
          ) : null}


        </tbody>
      </table>



      <div className=" relative w-full h-14  mt-1 bg-gray-300 text-[35px] ">
        <h1 className="absolute bottom-3 right-1/2 translate-x-1/2">Reporte de Documentos</h1>
      </div>



      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-darkblue text-white ">
            <tr>
              <th className="px-5 py-3 border-b-2  text-left text-base font-semibold  uppercase tracking-wider">
                ID Documento
              </th>
              <th className="px-5 py-3 border-b-2  text-left text-base font-semibold  uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-5 py-3 border-b-2  text-left text-base font-semibold  uppercase tracking-wider">
                Tipo Documento
              </th>
              <th className="px-5 py-3 border-b-2  text-left text-base font-semibold  uppercase tracking-wider">
                # Solicitud
              </th>
              <th className="px-5 py-3 border-b-2  text-left text-base font-semibold  uppercase tracking-wider">
                Tipo Solicitud
              </th>
              <th className="px-5 py-3 border-b-2  text-left text-base font-semibold  uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-5 py-3 border-b-2  text-left text-base font-semibold  uppercase tracking-wider">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody>
            {documentos_f &&
              documentos_f.map((documento, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : ""}>
                  <td className="px-6 py-4 whitespace-no-wrap">{formato_0(documento.id, 4)}</td>
                  <td className="px-6 py-4 whitespace-no-wrap">{documento.nombre}</td>
                  <td className="px-6 py-4 whitespace-no-wrap">{documento.extencion}</td>
                  <td className="px-6 py-4 whitespace-no-wrap">{documento.solicitud.numero}</td>
                  <td className="px-6 py-4 whitespace-no-wrap">{documento.solicitud.tipo.nombre}</td>
                  <td className="px-6 py-4 whitespace-no-wrap">{documento.user.name}</td>
                  <td className="px-6 py-4 whitespace-no-wrap">
                    {documento.created_at && format(new Date(documento.created_at), "dd/MM/yyyy hh:mm:ss a")}
                  </td>
                </tr>
              ))
            }
            
            <tr className="bg-darkblue text-white">
              <td colSpan="6" className="py-2 font-semibold">
                Total de documentos: {documentos_f?.length || 0}
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
}
