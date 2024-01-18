
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useState } from 'react';
import { Head, useForm } from "@inertiajs/react";
import Modal from '@/Components/Modal';
import Register from '@/Components/Register';
import EditUser from '@/Components/EditUser';
import DeleteUser from '@/Components/DeleteUser';
import Loading from '@/Components/Loading';
import { DataTable } from '@/Components/DataTable';




export default function Usuarios({ auth, users, roles, msj }) {

  const [sortingData, setSortingData] = useState(users);
  const [searchValue, setSearchValue] = useState('');
  const [selectedUser, setSelectedUser] = useState({});
  const [isCliente, setIsCliente] = useState();
  const [updateUser, setUpdateUser] = useState(false);
  const [deleteUser, setDeleteUser] = useState(false);
  const [newUser, setNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msjError, setmsjError] = useState({});
  const [show, setShow] = useState(msj != null);

  useEffect(() => {

    setShow(msj?.success != undefined);

    setNewUser(msj?.error != null);

    setmsjError(msj);



  }, [msj]);

  const { data, setData, post, reset } = useForm({
    name: null,
    email: null,
    telefono: null,
    rnc: null,
    empresa: null,
    rol_id: null,
    status: null
  });

  const changeRol = (e) => {

    let value = e.target.value;
    setData('rol_id', e.target.value)
    if (value == 2) {
      setIsCliente(true)
    } else {
      setIsCliente(false)
    }

  }

  const editUser = (key) => {

    const user = users.filter((user) => {
      return user.id === key;
    })

    setUpdateUser(true)
    setSelectedUser(user[0])
    setData('rol_id', user[0].rol_id)

  }

  const destroyUser = (key) => {

    const user = users.filter((user) => {
      return user.id === key;
    })

    setDeleteUser(true)
    setSelectedUser(user[0])

  }

  function search(keyword) {
    keyword = keyword.toLowerCase()


    setSearchValue(keyword);

    const results = users.filter((user) => {
      return (
        user.name.toLowerCase().includes(keyword)
      );
    });

    setSortingData(results);
  }

  const submit = (e) => {
    e.preventDefault();

    setNewUser(false);
    setLoading(true);

    post(route('register'), {
      onSuccess: () => {
        setLoading(false);

      }
    });

  };

  const create = () => {
    setNewUser(true);
  };

  const update = (e) => {
    e.preventDefault();

    setUpdateUser(false);

    setLoading(true);

    post(route('usuario.update', selectedUser.id), {

      onSuccess: () => {

        setLoading(false);

        setSelectedUser({})

      }
    });
  };

  const destroy = (e) => {
    e.preventDefault();

    setDeleteUser(false);
    setLoading(true);
    post(route('usuario.delete', selectedUser.id), {
      onSuccess: () => {
        setLoading(false);
        setSelectedUser({});
        setSortingData(users);
      }
    });


  };

  useEffect(() => {
    setSortingData(users);
  }, [users])

  useEffect(() => {
    return () => {
      reset('password', 'password_confirmation');
    };
  }, []);

  useEffect(() => {
    setIsCliente(selectedUser.rol_id == 2)
  }, [selectedUser])


  const tbStructure = {
    'Usuario': 'name',
    'Rol': 'rol.nombre',
    'Correo': 'email',
    'Estado': 'status'
  }


  return (

    <AuthenticatedLayout
      countNotificaciones={auth.countNotificaciones}
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Usuarios</h2>}
    >
      <Head title="Usuarios" />

      <Modal show={newUser}>
        <Register
          msj={msjError}
          roles={roles}
          setData={setData}
          isCliente={isCliente}
          data={data}
          submit={submit}
          changeRol={changeRol}
          hideModal={() => { setNewUser(false), reset(), setmsjError({}) }}

        />
      </Modal>

      <Modal show={updateUser}>
        <EditUser
          data={data}
          roles={roles}
          isCliente={isCliente}
          msj={msj}
          changeRol={changeRol}
          hideModal={() => setUpdateUser(false)}
          update={update}
          setData={setData}
          selectedUser={selectedUser}
        />
      </Modal>

      <Modal show={deleteUser}>
        <DeleteUser
          deleteUser={deleteUser}
          hideModal={() => setDeleteUser(false)}
          destroy={destroy}
          selectedUser={selectedUser}
        />
      </Modal>

      <Modal show={loading}>
        <Loading />
      </Modal>

      <Modal show={show} maxWidth="sm" onClose={() => setShow(false)}>
        <img
          className="z-50 w-20 absolute left-1/2 transform -translate-x-1/2 -top-10 bg-white rounded-full p-2  "
          src="/assets/svg/check.svg"
          alt=""
        />

        <div className="text-center relative mb-2 ">
          <h1 className="mt-14 mb-8 font-semibold">{msj?.success || msj?.error}</h1>

          <div className="hover:scale-110">
            <button onClick={() => setShow(false)} className="bg-green-600 rounded-lg px-3 py-1 text-lg font-bold text-white  " >
              Cerrar
            </button>
          </div>


        </div>
      </Modal>

      <div className="container mx-auto px-4 sm:px-8 py-8">

        {sortingData &&
          <DataTable
            data={sortingData}
            action={true}
            tbStructure={tbStructure}
            onNew={create}
            proteccionUser={auth.user.id}
            onUpdate={editUser}
            onDelete={destroyUser}
          />
        }

      </div>

    </AuthenticatedLayout>
  )

}
