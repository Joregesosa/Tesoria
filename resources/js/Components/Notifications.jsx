import { Link } from '@inertiajs/react'
import React from 'react'
import { format } from 'date-fns';

export const Notifications = ({
    user,
    conf,
    emisor,
    mensaje,
    selectNotification,
    date, }) => {
        const formattedDate = format(new Date(date),'dd/MM/yyyy hh:mm:ss a')
    return (
      
        <li onClick={selectNotification} className={`flex w-80 min-h-fit overflow-hidden bg-blue-500 rounded-md cursor-pointer`} >
            <div className="flex flex-col gap-2 p-2 ms-2 text-textgray w-full bg-orange-100">
                
                {(user.rol_id) == 2 ?
                (<span>
                    Tesoria
                </span>) : ( <span>
                    De: {emisor}
                </span>)
            }
               

                <p className="font-medium text-sm">
                    {mensaje}
                </p>

                <span className="text-xs">
                   {formattedDate}
                </span>
            </div>
        </li>
    )
}
