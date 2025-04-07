import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_PEDIDOS = 'http://localhost:8000/api/pedidos';
const API_PRODUCTOS = 'http://localhost:8000/api/productos';

function CrearPedidoModal({ onClose, onPedidoCreado }) {
    const [productos, setProductos] = useState([]);
    const [pedido, setPedido] = useState({
        ID_users: 1,  
        OrderDate: new Date().toISOString().split('T')[0], 
        details: []
    });
    const [productoSeleccionado, setProductoSeleccionado] = useState('');
    const [cantidad, setCantidad] = useState(1);

    // Cargar productos desde la API
    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const response = await axios.get(API_PRODUCTOS);
                setProductos(response.data);
            } catch (error) {
                console.error('Error al cargar productos:', error);
            }
        };
        cargarProductos();
    }, []);

    const agregarProducto = () => {
        if (!productoSeleccionado || cantidad < 1) return;

        const producto = productos.find(p => p.id === parseInt(productoSeleccionado));
        if (!producto) return;

        setPedido(prevPedido => ({
            ...prevPedido,
            details: [...prevPedido.details, { ID_product: producto.id, RequestedQuantity: cantidad }]
        }));

        setProductoSeleccionado('');
        setCantidad(1);
    };

    const crearPedido = async () => {
        const pedidoData = {
            ...pedido,
            OrderDate: new Date().toISOString().split('T')[0] 
        };

        console.log('Enviando pedido:', pedidoData);

        try {
            await axios.post(API_PEDIDOS, pedidoData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            alert('Pedido creado exitosamente');
            onPedidoCreado();
            
            setPedido({
                ID_users: 1,  
                OrderDate: new Date().toISOString().split('T')[0],
                details: []
            });

        } catch (error) {
            console.error('Error al crear pedido:', error.response?.data || error);
        }
    };

    return (
        <div className="modal">
            <div className="form-row">
                <h2>Crear Pedido</h2>
                <label>Seleccionar Producto:</label>
                <select value={productoSeleccionado} onChange={(e) => setProductoSeleccionado(e.target.value)}>
                    <option value=""> Seleccionar </option>
                    {productos.map((producto) => (
                        <option key={producto.id} value={producto.id}>
                            {producto.ProductName} (Stock: {producto.CurrentStock})
                        </option>
                    ))}
                </select>

                <label> Cantidad </label>
                <input 
                    type="number" 
                    value={cantidad} 
                    onChange={(e) => setCantidad(parseInt(e.target.value, 10) || 1)} 
                    min="1" 
                />
                <button onClick={agregarProducto} className='button-sum'>Agregar Producto</button>

                <h3>Detalles del Pedido</h3>
                <ul>
                    {pedido.details.map((detalle, index) => (
                        <li key={index}>
                            Producto ID: {detalle.ID_product}, Cantidad: {detalle.RequestedQuantity}
                        </li>
                    ))}
                </ul>

                <button onClick={crearPedido} className='button-save'>Guardar Pedido</button>
                <button onClick={onClose} className='button-close'>Cerrar</button>
            </div>
        </div>
    );
}

export default CrearPedidoModal;
