import React  from 'react'
import Modal from './Modal';

export function SuccessAlert({show, hideModal, msj}) {
 
    return (
        <Modal show={show} maxWidth="sm" onClose={hideModal}>
            <img
                className="z-50 w-20 absolute left-1/2 transform -translate-x-1/2 -top-10 bg-white rounded-full p-2  "
                src="/assets/svg/check.svg"
                alt=""
            />

            <div className="text-center relative mb-2 ">
                <h1 className="mt-14 mb-8 font-semibold">{msj?.success}</h1>

                <div className="hover:scale-110">
                    <button onClick={hideModal} className="bg-green-600 rounded-lg px-3 py-1 text-lg font-bold text-white  " >
                        Cerrar
                    </button>
                </div>

            </div>
        </Modal>

    )
}
