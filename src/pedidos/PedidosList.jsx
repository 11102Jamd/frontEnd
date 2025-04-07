import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CrearPedidoModal from './CrearPedido';

const API_PEDIDOS = 'http://localhost:8000/api/pedidos';

function Pedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);

    useEffect(() => {
        obtenerPedidos();
    }, []);

    const obtenerPedidos = async () => {
        try {
            const response = await axios.get(API_PEDIDOS);
            setPedidos(response.data);
        } catch (error) {
            console.error('Error al obtener los pedidos:', error);
        }
    };

    const eliminarPedido = async (id) => {
        try {
            await axios.delete(`${API_PEDIDOS}/${id}`);
            obtenerPedidos();
        } catch (error) {
            console.error('Error al eliminar pedido:', error);
        }
    };

    return (
        <div>
            <h1>Gestión de Pedidos</h1>
            <button onClick={() => setMostrarModal(true)} className='button-new'>Crear Pedido</button>

            <h2>Lista de Pedidos</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>ID_Usuario</th>
                        <th>Fecha de Pedido</th>
                        <th>Total de Pedido</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pedidos.map((pedido) => (
                        <tr key={pedido.id}>
                            <td>{pedido.ID_users}</td>
                            <td>{pedido.OrderDate}</td>
                            <td>{pedido.OrderTotal}</td>
                            <td>
                                <button onClick={() => eliminarPedido(pedido.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {mostrarModal && (
                <CrearPedidoModal
                    onClose={() => setMostrarModal(false)}
                    onPedidoCreado={obtenerPedidos}
                />
            )}
        </div>
    );
}

export default Pedidos;
