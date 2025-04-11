import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import CreateProductModal from './CrearProducto';
import EditProductModal from './EditarProducto';

const API_PRODUCTOS = 'http://localhost:8000/api/productos';

function Productos() {
    const [producto, setProductos] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [pending, setPending] = useState(true);

    useEffect(() => {
        obtenerProductos();
    }, []);

    const obtenerProductos = async () => {
        try {
            setPending(true);
            const response = await axios.get(API_PRODUCTOS);
            setProductos(response.data);
            setPending(false);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            setPending(false)
        }
    };

    const eliminarProducto = async (id) => {
        try {
            await axios.delete(`${API_PRODUCTOS}/${id}`);
            obtenerProductos();
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    };

    const customStyles = {
        headCells:{
            style:{
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
    }

    const columnas = [
        {
            name: 'Producto',
            selector: row => row.ProductName,
            sortable: true,
        },
        {
            name: 'Cantidad Inicial',
            selector: row => row.InitialQuantity,
            sortable: true,
        },
        {
            name: 'Stock',
            selector: row => row.CurrentStock,
            sortable: true,
        },
        {
            name: 'Precio',
            selector: row => row.UnityPrice,
            sortable: true,
        },
        {
            name: 'Acciones',
            cell: row => (
                <div className='btn-group' role="group">
                    <button
                        onClick={() => eliminarProducto(row.id)}
                        className='btn btn-danger btn-sm'
                    >
                        Eliminar
                    </button>
                    <button
                        onClick={() => {
                            console.log('Editando producto: ', row);
                            setProductoSeleccionado(row);
                        }}
                        className='btn btn-primary btn-sm ms-2'
                    >
                        Editar
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverFlow: true,
        },
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
                    <h1 className='h4'>Gestion de Productos</h1>
                </div>
                
                <div className='card-body'>
                    <div className='d-flex justify-content-between mb-3'>
                        <button
                            onClick={() => setMostrarModal(true)}
                            className='btn btn-success'
                        >
                            <i className='bi bi-plus-circle'></i> Crear Producto
                        </button>
                    </div>

                    <DataTable
                        title="Lista de Productos"
                        columns={columnas}
                        data={producto}
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
                        noDataComponent={<div className="alert alert-info">No hay productos registrados</div>}
                    />
                </div>
            </div>
            {mostrarModal && (
                <CreateProductModal
                        onClose={() => setMostrarModal(false)}
                        onProductCreated={obtenerProductos}
                    />
                )}

            {productoSeleccionado && (
                <EditProductModal
                    product={productoSeleccionado}
                    onClose={() => setProductoSeleccionado(null)}
                    onProductUpdate={obtenerProductos}
                />
            )}
        </div>
    );
}

export default Productos;