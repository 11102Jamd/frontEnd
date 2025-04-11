import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import CreateSupplierModal from "./CrearProveedor";
import EditSupplierModal from "./EditarProveedor";

const API_PROVEEDOR = 'http://localhost:8000/api/proveedores';

function Proveedor(){
    const [proveedores, setProveedor] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
    const [pending, setPending] = useState(true);

    useEffect(() => {
        obtenerProveedor();
    }, []);

    const obtenerProveedor = async () => {
        try {
            setPending(true);
            const response = await axios.get(API_PROVEEDOR);
            setProveedor(response.data);
            setPending(false);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            setPending(false);
        }
    };

    const eliminarProveedor = async (id) => {
        try {
            await axios.delete(`${API_PROVEEDOR}/${id}`);
            obtenerProveedor();
        } catch (error) {
            console.error("Error al eliminar el proveedor");
        }
    };

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#343a40', 
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
            },
        },
        rows: {
            style: {
                minHeight: '50px',
                '&:nth-child(even)': {
                    backgroundColor: '#f8f9fa', // Color claro alterno
                },
                '&:hover': {
                    backgroundColor: '#e9ecef !important', // Color hover
                },
            },
        },
        pagination: {
            style: {
                backgroundColor: '#f8f9fa',
                borderTop: '1px solid #dee2e6',
            },
        },
    };

    const columnas = [
        {
            name: 'Proveedor',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Correo Electronico',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Direccion',
            selector: row => row.Addres,
            sortable: true,
        },
        {
            name: 'Telefono',
            selector: row => row.Phone,
            sortable: true,
        },
        {
            name: 'Acciones',
            cell: row => (
                <div className="btn-group" role="group">
                    <button 
                        onClick={() => eliminarProveedor(row.id)} 
                        className='btn btn-danger btn-sm'
                    >
                        Eliminar
                    </button>
                    <button 
                        onClick={() => {
                            console.log('Editando Proveedor:', row); 
                            setProveedorSeleccionado(row);
                        }} 
                        className='btn btn-primary btn-sm ms-2'
                    >
                        Editar
                    </button>
                </div>
            ),
            ignoreRowClick: true,
        },
    ];

    const paginationOptions = {
        rowsPerPageText: 'Registros por página:',
        rangeSeparatorText: 'de',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Todos',
        noRowsPerPage: false,
    };
    return(

        <div className='container mt-4'>
            <div className='card'>
                <div className='card-header bg-primary text-white'>
                    <h1 className='h4'>Gestión de Proveedores</h1>
                </div>

                <div className='card-body'>
                    <div className='d-flex justify-content-between mb-3'>
                        <button 
                            onClick={() => setMostrarModal(true)} 
                            className='btn btn-success'
                        >
                            <i className="bi bi-plus-circle"></i> Crear Proveedor
                        </button>
                    </div>

                    <DataTable
                        title="Lista de Proveedores"
                        columns={columnas}
                        data={proveedores}
                        pagination
                        paginationPerPage={5} 
                        paginationRowsPerPageOptions={[5, 10, 15, 20]} 
                        paginationComponentOptions={paginationOptions}
                        highlightOnHover
                        pointerOnHover
                        responsive
                        striped
                        customStyles={customStyles}
                        progressPending={pending}
                        progressComponent={<div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>}
                        noDataComponent={<div className="alert alert-info">No hay usuarios registrados</div>}
                    />
                </div>
            </div>
            {mostrarModal && (
                <CreateSupplierModal
                onClose={() => setMostrarModal(false)}
                onSupplierCreated={obtenerProveedor}
                />
            )}

            {proveedorSeleccionado && (
                <EditSupplierModal
                    supplier={proveedorSeleccionado}
                    onClose={() => setProveedorSeleccionado(null)}
                    onSupplierUpdated={obtenerProveedor}
                />
            )}
        </div>
    );
}

export default Proveedor;