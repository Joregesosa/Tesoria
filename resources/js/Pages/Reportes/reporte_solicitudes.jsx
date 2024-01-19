import { format } from "date-fns";

export default function Reporte({ solicitudes_f, datos,empresa }) {

  return (
    <div className=" mx-10 bg-white ">

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
              <h1 className="w-20  font-medium ">Desde:</h1>
              {datos?.inicio}
            </td>
            <td className="flex w-1/2">
              <h1 className="w-20  font-medium">Fecha : </h1>
              {datos?.fecha}
            </td>
          </tr>

          <tr className="w-full flex" >
            <td className="flex w-1/2">
              <h1 className="w-20  font-medium ">Hasta:</h1>
              {datos?.fin }
            </td>
            <td className="flex w-1/2">
              <h1 className="w-20  font-medium">Hora:</h1>
              {datos?.hora}
            </td>
          </tr>

         

            <tr className="w-full flex" >
            {datos?.tipo ? (
              <td className="flex w-1/2">
                <h1 className="w-20  font-medium ">Tipo:</h1>
                {solicitudes_f[0].tipo.nombre}
              </td>
                ) : null}


              {datos?.cliente ? (
              <td className="flex w-1/2">
                <h1 className="w-20  font-medium ">Cliente:</h1>
                {solicitudes_f[0].user.name}
              </td>
                ) : null}


          {!(datos?.tipo && datos?.cliente) && datos?.estado ? (
              <td className="flex w-1/2">
                <h1 className="w-20  font-medium ">Estado:</h1>
                {solicitudes_f[0].status.nombre}
              </td>
              
                ) : null}


            </tr>

            {datos?.tipo && datos?.cliente && datos?.estado ? (
              <tr>
              <td className="flex w-1/2">
                <h1 className="w-20  font-medium ">Estado de solicitud:</h1>
                {solicitudes_f[0].status.nombre}
              </td>
              </tr>
              
                ) : null}
        


        </tbody>
      </table>
      
        <div className=" relative w-full h-14  mt-1 bg-gray-300 text-[35px] ">
          <h1 className="absolute bottom-3 right-1/2 translate-x-1/2">Reporte de Solicitudes</h1>
        </div>

        <table className="min-w-full w-full">
          <thead >
            <tr className="bg-darkblue   text-left">
              <th className="pb-3 text-white uppercase tracking-wider">
                #Solicitud
              </th>
              <th className="pb-3 text-white uppercase tracking-wider">
                Tipo
              </th>
              <th className="pb-3 text-white uppercase tracking-wider">
                Cliente
              </th>
              <th className="pb-3 text-white uppercase tracking-wider">
                RNC
              </th>
              <th className="pb-3 text-white uppercase tracking-wider">
                Fecha
              </th>
              <th className="pb-3 text-white uppercase tracking-wider">
                Status
              </th>
              <th className="pb-3 text-white uppercase tracking-wider">
                Correo
              </th>
            </tr>
          </thead>
          <tbody>
            {solicitudes_f &&
              solicitudes_f.map((user, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                  <td className="pb-4 pt-2 h-fit whitespace-no-wrap">{user.numero}</td>
                  <td className="pb-4 pt-2 whitespace-no-wrap">{user.tipo.nombre}</td>
                  <td className="pb-4 pt-2 whitespace-no-wrap">{user.user.name}</td>
                  <td className="pb-4 pt-2 whitespace-no-wrap">{user.user.rnc}</td>
                  <td className="pb-4 pt-2 whitespace-no-wrap">
                    {format(new Date(user.created_at), "dd/MM/yyyy hh:mm:ss a")}
                  </td>
                  <td className=" whitespace-no-wrap">{user.status.nombre}</td>
                  <td className=" whitespace-no-wrap">{user.user.email}</td>
                </tr>
              ))
            }

            <tr className="bg-gray-300 mt-2 text-black ">
              <td className="pb-4 ">
                Total de Solicitudes: {solicitudes_f?.length || 0}
              </td>
            </tr>

          </tbody>
        </table>
   
    </div>
  );
}
