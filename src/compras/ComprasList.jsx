import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import CrearOrdenModal from "./CrearCompra";
import Swal from "sweetalert2";

const API_COMPRAS = 'http://localhost:8000/api/compras';
const API_PROVEEDORES = 'http://localhost:8000/api/proveedores';

function Compras(){
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [suppliers, setSupplier] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [pending, setPending] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setPending(true);
                const [purchaseOrdersResponse, suppliersResponse] = await Promise.all([
                    axios.get(API_COMPRAS),
                    axios.get(API_PROVEEDORES)
                ]);
                setPurchaseOrders(purchaseOrdersResponse.data);
                setSupplier(suppliersResponse.data);
                setPending(false);
            } catch (error) {
                console.error("Error al Obtener los datos: ", error);
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudieron cargar los datos iniciales',
                    icon: 'error'
                });
                setPending(false);
            }
        };
        loadData();
    }, []);
    
    const getNameSupplier = (supplierId) => {
        const supplier = suppliers.find(s => s.id === supplierId);
        return supplier ? `${supplier.name}` : 'Proveedor No Encontrado'
    };

    const deletePurchaseOrder = async (id) => {
        try {
            await axios.delete(`${API_COMPRAS}/${id}`);
            setPurchaseOrders(purchaseOrders.filter(purchaseOrder => purchaseOrder.id !== id));
        } catch (error) {
            console.error('Error al eliminar la Orden de Compra', error);
        }
    }

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
                    backgroundColor: '#f8f9fa',
                },
                '&:hover': {
                    backgroundColor: '#e9ecef !important',
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
            name: 'Numero de Orden',
            selector: row => row.id,
            sortable: true,
        },
        {
            name: 'Proveedor',
            selector: row => `${row.ID_supplier} - ${getNameSupplier(row.ID_supplier)}`,
            sortable: true,
        },
        {
            name: 'Fecha de la orden',
            selector: row => row.PurchaseOrderDate,
            sortable: true,
        },
        {
            name: 'Total Orden de Compra',
            selector: row => row.PurchaseTotal,
            sortable: true,
        },
        {
            name:'Acciones',
            cell: row => (
                <div className="btn-group" role="group">
                    <button
                        onClick={() => deletePurchaseOrder(row.id)}
                        className="btn btn-danger btn-sm"
                    >
                        Eliminar
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
                    <h1 className='h4'>Gestión de Compras</h1>
                </div>

                <div className='card-body'>
                    <div className='d-flex justify-content-between mb-3'>
                        <button 
                            onClick={() => setMostrarModal(true)} 
                            className='btn btn-success'
                        >
                            <i className="bi bi-plus-circle"></i> Crear Compra
                        </button>
                    </div>

                    <DataTable
                        title="Lista de Pedidos"
                        columns={columnas}
                        data={purchaseOrders}
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
                        noDataComponent={<div className="alert alert-info">No hay Pedios registrados</div>}
                    />
                </div>
            </div>
            

            {mostrarModal && (
                <CrearOrdenModal
                    onClose={() => setMostrarModal(false)}
                    onPurchaseOrderCreated={() => {
                        const loadData = async () => {
                            try {
                                setPending(true);
                                const [purchaseOrdersResponse, supplierResponse] = await Promise.all([
                                    axios.get(API_COMPRAS),
                                    axios.get(API_PROVEEDORES)
                                ]);
                                setPurchaseOrders(purchaseOrdersResponse.data);
                                setSupplier(supplierResponse.data);
                                setPending(false);
                            } catch (error) {
                                console.error('Error al obtener datos:', error);
                                setPending(false);
                            }
                        };
                        loadData();
                    }}
                />
            )}
        </div>
    );
}

export default Compras;