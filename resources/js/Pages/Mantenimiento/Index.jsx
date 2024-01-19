
import { DataTable } from '@/Components/DataTable';
import DeleteUser from '@/Components/DeleteUser';
import { EditTipoSolicitud } from '@/Components/EditTipoSolicitud';
import Empresa from '@/Components/Empresa';
import Loading from '@/Components/Loading';
import Modal from '@/Components/Modal';
import { NewTipoSolicitud } from '@/Components/NewTipoSolicitud';
import { SuccessAlert } from '@/Components/SuccessAlert';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from "@inertiajs/react";
import { data } from 'autoprefixer';
import { useEffect, useState } from 'react';



export default function Mantenimiento({ auth, tipoSolicitudes, msj, empresa }) {
  const [currentData, setCurrentData] = useState(tipoSolicitudes);
  const [modalDestroy, setModalDestroy] = useState(false)
  const [newTipoSilicitud, setNewTipoSilicitud] = useState(false)
  const [editTipoSilicitud, setEditTipoSilicitud] = useState(false)
  const [tipoSolicitudData, setTipoSolicitudData] = useState();
  const [succesAlert, setSuccesAlert] = useState(msj?.success);
  const [loading, setLoading] = useState(false)

  const { post } = useForm({});

  useEffect(() => {

    setSuccesAlert(msj?.success != undefined);

  }, [msj]);

  useEffect(() => {
    if (tipoSolicitudes) {
      const dataList = tipoSolicitudes.map(tipoSolicitud => {

        delete tipoSolicitud.created_at;
        delete tipoSolicitud.updated_at;


        if (tipoSolicitud.tipo === 1) {
          tipoSolicitud['categoria'] = 'Servicios';

          return tipoSolicitud;
        }
        if (tipoSolicitud.tipo === 2) {
          tipoSolicitud['categoria'] = 'Certificaciones';

          return tipoSolicitud;
        }
        if (tipoSolicitud.tipo === 3) {
          tipoSolicitud['categoria'] = 'Estados Financieros';

          return tipoSolicitud;
        }
        if (tipoSolicitud.tipo === 4) {
          tipoSolicitud['categoria'] = 'Reportes Generales';

          return tipoSolicitud;
        }

      })
      setCurrentData(dataList);
     
    }
  }, [tipoSolicitudes]);

  const tbStructure = {
    'Tipo de Solicitud': 'nombre',
    'Categoria': 'categoria',
    'Estado': 'status'
  }

  function getTipoSolicitudData(id) {
    const data = tipoSolicitudes.filter(tipoSolicitud => tipoSolicitud.id === id);
    setTipoSolicitudData(data[0]);
  }

  const deleteModal = (id) => {
    getTipoSolicitudData(id)
    setModalDestroy(true)

  }

  const editModal = (id) => {
    getTipoSolicitudData(id)
    setEditTipoSilicitud(true)
  }

  function destroy(e) {
    e.preventDefault();
    setModalDestroy(false)
    setLoading(true);

    post(route('tipoSolicitud.delete', tipoSolicitudData.id), {
      onSuccess: () => {
        setLoading(false);
      }
    });
  }

  return (

    <AuthenticatedLayout
      countNotificaciones={auth.countNotificaciones}
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Mantenimiento</h2>}
    >
      <Head title="Mantenimiento" />


      <div className="container mx-auto px-4 sm:px-8">
       <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500   mt-8 ">
             <li className="me-2">
              <Link href={route('empresa.index')}className={`inline-block p-4 rounded-t-lg ${empresa ? 'activeTab': 'NoactiveTab'}`}>Empresa</Link>
            </li>
            <li className="me-2">
              <Link href={route('tipoSolicitud.index')} aria-current="page" className={` inline-block p-4 rounded-t-lg    ${tipoSolicitudes ? 'activeTab' : 'NoactiveTab'}`}>Solicitudes</Link>
            </li>

            
          </ul>
        <div className="mb-8 bg-gray-300 rounded-xl rounded-tl-none  p-2">

          {currentData &&
            <DataTable
              data={currentData}
              action={true}
              tbStructure={tbStructure}
              onNew={() => setNewTipoSilicitud(true)}
              onUpdate={editModal}
              onDelete={deleteModal}
            

            />
          }

          {newTipoSilicitud &&
            <NewTipoSolicitud
              show={newTipoSilicitud}
              hideModal={() => setNewTipoSilicitud(false)}
              setLoading={setLoading}
            />
          }

          {editTipoSilicitud &&
            <EditTipoSolicitud
              show={editTipoSilicitud}
              tipoSolicitudData={tipoSolicitudData}
              hideModal={() => setEditTipoSilicitud(false)}
              setLoading={setLoading}
            />
          }

          <SuccessAlert
            hideModal={() => setSuccesAlert(false)}
            show={succesAlert}
            msj={msj}
          />
          {loading &&
            <Modal maxWidth='sm' show={loading}>
              <Loading />
            </Modal>
          }

          <Modal show={modalDestroy}>
            <DeleteUser
              hideModal={() => setModalDestroy(false)}
              destroy={destroy}
              selectedUser={tipoSolicitudData}
            />

          </Modal>
          
          {empresa && 
            <Empresa
              empresa={empresa}
              setLoading={setLoading}
            />

          }

        </div>

      </div>

    </AuthenticatedLayout>
  )

}
