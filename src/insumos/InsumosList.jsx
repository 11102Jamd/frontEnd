import React, { useState, useEffect, use } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import CreateInputModal from './CrearInsumo';
import EditInputModal from './EditarInusmo';
import Swal from 'sweetalert2';

const API_INSUMOS = 'http://localhost:8000/api/insumos';

function Insumos() {
    const [insumo, setInsumos] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [insumoSeleccionado, setInsumoSeleccionado] = useState(null);
    const [pending, setPending] = useState(true);

    useEffect(() => {
        obtenerInsumos();
    }, []);

    const obtenerInsumos = async () => {
        try {
            setPending(true);
            const response = await axios.get(API_INSUMOS);
            setInsumos(response.data);
            setPending(false);
        } catch (error) {
            console.error('Error al obtener los Insumos:', error);
            setPending(false);
        }
    };

    const eliminarInsumos = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esta acción!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${API_INSUMOS}/${id}`);
                await Swal.fire({
                    title: '¡Eliminado!',
                    text:'El insumo ha sido eliminado.',
                    icon: 'success'
                });
                obtenerInsumos();
            } catch (error) {
                console.error('Error al eliminar el Insumo:', error);
                Swal.fire(
                    'Error',
                    'No se pudo eliminar el insumo',
                    'error'
                );
            }
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
            name: 'Insumo',
            selector: row => row.InputName,
            sortable: true,
        },
        {
            name: 'Precio Unidad',
            selector: row => row.UnityPrice,
            sortable: true,
        },
        {
            name: 'Cantidad Inicial',
            selector: row => {
                const lastOrder = row.input_orders?.[0];
                return lastOrder ? `${lastOrder.InitialQuantity} ${lastOrder.UnitMeasurement}`: 'N/A'
            },
            sortable: true,
        },
        {
            name: 'Precio Cantidad',
            selector: row => {
                const lastOrder = row.input_orders?.[0];
                return lastOrder ? `${lastOrder.PriceQuantity}`: 'N/A'
            },
            sortable: true,
        },
        {
            name: 'Stock',
            selector: row => `${row.CurrentStock} ${row.UnitMeasurementGrams}`,
            sortable: true,
        },
        {
            name: 'Acciones',
            cell: row => (
                <div className="btn-group" role="group">
                    <button 
                        onClick={() => eliminarInsumos(row.id)} 
                        className='btn btn-danger btn-sm'
                    >
                        Eliminar
                    </button>
                    <button 
                        onClick={() => {
                            console.log('Editando insumo:', row); 
                            setInsumoSeleccionado(row);
                        }} 
                        className='btn btn-primary btn-sm ms-2'
                    >
                        Editar
                    </button>
                </div>
            ),
            ignoreRowClick: true,
        }
    ];

    const paginationOptions = {
        rowsPerPageText: 'Registros por página:',
        rangeSeparatorText: 'de',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Todos',
        noRowsPerPage: false,
    };

    return (
        <div className='container mt-4'>
            <div className='card'>
                <div className='card-header bg-primary text-white'>
                    <h1 className='h4'>Gestión de Insumos</h1>
                </div>

                <div className='card-body'>
                    <div className='d-flex justify-content-between mb-3'>
                        <button 
                            onClick={() => setMostrarModal(true)} 
                            className='btn btn-success'
                        >
                            <i className="bi bi-plus-circle"></i> Crear Insumo
                        </button>
                    </div>

                    <DataTable
                        title="Lista de Insumos"
                        columns={columnas}
                        data={insumo}
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
                <CreateInputModal
                    onClose={() => setMostrarModal(false)}
                    onInputCreated={obtenerInsumos}
                />
            )}

            {insumoSeleccionado && (
                <EditInputModal
                    input={insumoSeleccionado}
                    onClose={() => setInsumoSeleccionado(null)}
                    onInputUpdated={obtenerInsumos}
                />
            )}
        </div>
    );
}

export default Insumos;
