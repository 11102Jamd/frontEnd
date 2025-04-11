import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import CreateOrderModal from './CrearPedido';

const API_PEDIDOS = 'http://localhost:8000/api/pedidos';
const API_USUARIOS = 'http://localhost:8000/api/usuarios';

function Pedidos() {
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [pending, setPending] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setPending(true);
                const [ordersResponse, usersResponse] = await Promise.all([
                    axios.get(API_PEDIDOS),
                    axios.get(API_USUARIOS)
                ]);
                setOrders(ordersResponse.data);
                setUsers(usersResponse.data);
                setPending(false);
            } catch (error) {
                console.error('Error al obtener datos:', error);
                setPending(false);
            }
        };
        loadData();
    }, []);

    const getNameUser = (userId) => {
        const user = users.find(u => u.id === userId);
        return user ? `${user.name1} ${user.surname1}` : 'Usuario no encontrado';
    };

    const eliminarPedido = async (id) => {
        try {
            await axios.delete(`${API_PEDIDOS}/${id}`);
            setOrders(orders.filter(order => order.id !== id));
        } catch (error) {
            console.error('Error al eliminar pedido:', error);
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
            name: 'Numero de Pedido',
            selector: row => row.id,
            sortable: true,
        },
        {
            name: 'Usuario',
            selector: row => `${row.ID_users} - ${getNameUser(row.ID_users)}`,
            sortable: true,
        },
        {
            name: 'Fecha de Pedido',
            selector: row => row.OrderDate,
            sortable: true,
        },
        {
            name: 'Total de Orden',
            selector: row => row.OrderTotal,
            sortable: true,
        },
        {
            name: 'Acciones',
            cell: row => (
                <div className="btn-group" role="group">
                    <button 
                        onClick={() => eliminarPedido(row.id)} 
                        className='btn btn-danger btn-sm'
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
                    <h1 className='h4'>Gestión de Pedidos</h1>
                </div>

                <div className='card-body'>
                    <div className='d-flex justify-content-between mb-3'>
                        <button 
                            onClick={() => setMostrarModal(true)} 
                            className='btn btn-success'
                        >
                            <i className="bi bi-plus-circle"></i> Crear Pedido
                        </button>
                    </div>

                    <DataTable
                        title="Lista de Pedidos"
                        columns={columnas}
                        data={orders}
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
                <CreateOrderModal
                    onClose={() => setMostrarModal(false)}
                    onOrderCreated={() => {
                        const loadData = async () => {
                            try {
                                setPending(true);
                                const [ordersResponse, usersResponse] = await Promise.all([
                                    axios.get(API_PEDIDOS),
                                    axios.get(API_USUARIOS)
                                ]);
                                setOrders(ordersResponse.data);
                                setUsers(usersResponse.data);
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

export default Pedidos;