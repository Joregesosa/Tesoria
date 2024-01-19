import { Notifications } from "@/components/notifications";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from "@inertiajs/react";
export default function Notificaciones({ auth, notificaciones }) {
    const { post } = useForm({});
   
    const selectNotification = (id, n_id) => {
        post(route("notificaciones.update", { id: id, n_id: n_id }));
    }
    
    return (
        <AuthenticatedLayout
            countNotificaciones={auth.countNotificaciones}
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Notificaciones
                </h2>
            }
        >
            <Head title="Notificaciones" />

            <div className="w-[calc(100%-3rem)] h-[calc(100%-3rem)] bg-[#f2f2f2] m-6 rounded-md overflow-y-auto">

                <ul className="flex flex-col gap-3 p-6">

                    {notificaciones?.length ? (
                        notificaciones.map(notificacion => (
                            <Notifications
                                user={auth.user}
                                key={notificacion.id}
                                emisor={notificacion.emisor}
                                mensaje={notificacion.mensaje}
                                date={notificacion.date}
                                selectNotification={() => selectNotification(notificacion.solicitud_id, notificacion.id)}
                                conf={false}
                            />
                        ))
                    ):(<h1>No hay Notificaciones</h1>)}

                </ul>

            </div>

        </AuthenticatedLayout>
    )

}
