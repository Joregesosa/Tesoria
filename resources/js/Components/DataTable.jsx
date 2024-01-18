import React, { useEffect, useState } from 'react'
import { Pagination } from './Pagination';

export function DataTable({ data, action, tbStructure, onNew, onUpdate, onDelete, proteccionUser = 0 }) {

    const [filteredData, setFilteredData] = useState(data);
    const [currentPage, setCurrentPage] = useState(1);
    const [slicedData, setSlicedData] = useState([]);
    const [currentOrder, setCurrentOrder] = useState('asc');
   

    const [itemsPerPage, setItemsPerPage] = useState(() => {
       
        const valor = localStorage.getItem("itemsPerPage");
        return valor ? parseInt(valor) : 5;
    });

    useEffect(() => {
        localStorage.setItem("itemsPerPage", itemsPerPage);
    }, [itemsPerPage]);




    const tbHeaders = Object.keys(tbStructure);
    const tbValues = Object.values(tbStructure);
    
    const handleSort = (columnName) => {
        if (tbStructure.hasOwnProperty(columnName)) {
            const key = tbStructure[columnName];
            const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
            setCurrentOrder(newOrder);

            const sortedData = [...data].sort((a, b) => {
                if (currentOrder === 'asc') {
                    return a[key] > b[key] ? 1 : -1;
                } else {
                    return b[key] > a[key] ? 1 : -1;
                }
            });
            setFilteredData(sortedData);

            setCurrentPage(1);

        }
    };


    // contar la data para separarla por pagina
    const getCurrentPageData = (dataToSlice) => {

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setSlicedData(dataToSlice.slice(startIndex, endIndex));

    };

    const searchData = (searchValue) => {
        setCurrentPage(1)
        // const searchedData = data.filter(item => item.nombre.toLocaleLowerCase().includes(searchValue))
        const searchedData = Object.values(data).filter(item => JSON.stringify(item).toLowerCase().includes(':"' + searchValue))
        setFilteredData(searchedData);
        console.log(proteccionUser)

    }
    useEffect(() => {
        setFilteredData(data)
    }, [data])

    useEffect(() => {
        getCurrentPageData(filteredData);
    }, [filteredData, currentPage,itemsPerPage])


    return (
        <>
            <div className="my-2 flex sm:flex-row flex-col gap-4 items-center">

                <div className="block relative">
                    <span className="h-full absolute inset-y-0 left-0 flex items-center pl-2">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-gray-500">
                            <path
                                d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z">
                            </path>
                        </svg>
                    </span>
                    <input placeholder="Buscar"
                        className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
                        onChange={(e) => searchData((e.target.value).toLocaleLowerCase())}
                    />
                </div>

                <div>
                    <button className='bg-blue-600 rounded-sm h-9 px-2 hover:bg-blue-700 hover:shadow-md  text-gray-950 hover:text-gray-100'
                        onClick={onNew}
                    >
                        Nuevo
                    </button>
                </div>
            </div>

            <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 pt-4 overflow-x-auto">
                <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                    <table className="min-w-full leading-normal overflow-hidden">
                        <thead>
                            <tr>
                                {tbHeaders.map(columnName =>
                                    <th key={columnName} onClick={() => handleSort(columnName)}
                                        className="thStyle cursor-pointer">
                                        {columnName}
                                    </th>
                                )}

                                {action &&
                                    <th className="thStyle">
                                        Accion
                                    </th>
                                }
                            </tr>

                        </thead>

                        <tbody >
                            {slicedData && slicedData.map((val, index) =>
                                <tr key={index}>
                                    {tbValues.map((key, i) =>



                                        key == 'status' ? (

                                            <td key={i} className="px-5 py-3 border-b border-gray-200 bg-white text-base font-medium">
                                                {


                                                    val.status == 0 ?
                                                        <span className='bg-red-300 px-2 rounded-lg'>Inactivo</span>
                                                        : <span className='bg-blue-300 px-2 rounded-lg'>Activo</span>

                                                }
                                            </td>
                                        ) : (
                                            <td key={i} className="px-5 py-3 border-b border-gray-200 bg-white text-base font-medium">
                                                {
                                                    key.split('.').reduce((acc, currentKey) => acc ? acc[currentKey] : undefined, val)
                                                }
                                            </td>

                                        )

                                    )}
                                    {action &&
                                        <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                                            {(proteccionUser == 0 || proteccionUser != val.id) && (
                                                <div className='flex gap-4'>
                                                    <span className='cursor-pointer' onClick={() => onUpdate(val.id)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 hover:stroke-blue-600">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                        </svg>
                                                    </span>

                                                    <span className='cursor-pointer' onClick={() => { onDelete(val.id) }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 hover:stroke-red-600">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg>
                                                    </span>
                                                </div>

                                            )


                                            }


                                        </td>
                                    }
                                </tr>
                            )
                            }
                        </tbody>
                    </table>
                </div>
                <div className='flex justify-between py-4'>

                    


                    <label className="flex items-center gap-4 h-10 bg-white text-gray-500 leading-tight  rounded-lg  overflow-hidden p-4">
                        <span>Filas</span>
                        <select 
                         value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(parseInt(e.target.value))}

                        className=" border-0 hover:bg-gray-100 hover:text-gray-700 " >
                            <option value="5" selected>5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>

                    </label>


                    <Pagination
                        data={filteredData}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        maxVisiblePages={itemsPerPage}
                    />
                </div>

            </div>
        </>
    )
}
