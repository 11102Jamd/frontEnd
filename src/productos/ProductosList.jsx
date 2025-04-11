import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CrearProductoModal from './CrearProducto';
import EditarProductoModal from './EditarProducto';
import DataTable from 'react-data-table-component';
const API_PRODUCTOS = 'http://localhost:8000/api/productos';

function Productos() {
    const [producto, setProductos] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

    useEffect(() => {
        obtenerProductos();
    }, []);

    const obtenerProductos = async () => {
        try {
            const response = await axios.get(API_PRODUCTOS);
            setProductos(response.data);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
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

    return (
        <div className='content-user'>
            <div className='content-list'>
                <div className='title'>
                    <h1>Gestión de Productos</h1>
                </div>

                <div className='subtitle'>
                    <h2>Lista de Productos</h2>
                </div>

                <div className='btn-new-product'>
                    <button onClick={() => setMostrarModal(true)} className='button-new'>Crear Producto</button>
                </div>
                <div className='list'>
                    <table border="1">
                        <thead>
                            <tr>
                                <th>Nombre Producto</th>
                                <th>Cantidad Inicial</th>
                                <th>Stock Actual</th>
                                <th>Precio Unidad</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {producto.map((producto) => (
                                <tr key={producto.id}>
                                    <td>{producto.ProductName}</td>
                                    <td>{producto.InitialQuantity}</td>
                                    <td>{producto.CurrentStock}</td>
                                    <td>{producto.UnityPrice} $</td>
                                    <td>
                                        <button onClick={() => eliminarProducto(producto.id)} className='button-danger'>Eliminar</button>
                                        <button onClick={() => setProductoSeleccionado(producto)} className='button-edit'>Editar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {mostrarModal && (
                    <CrearProductoModal
                        onClose={() => setMostrarModal(false)}
                        onProductoCreado={obtenerProductos}
                    />
                )}

                {productoSeleccionado && (
                    <EditarProductoModal
                        producto={productoSeleccionado}
                        onClose={() => setProductoSeleccionado(null)}
                        onProductoActualizado={obtenerProductos}
                    />
                )}
            </div>
        </div>
    );
}

export default Productos;