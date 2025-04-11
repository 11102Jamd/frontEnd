import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_PEDIDOS = 'http://localhost:8000/api/pedidos';
const API_PRODUCTOS = 'http://localhost:8000/api/productos';
const API_USUARIOS = 'http://localhost:8000/api/usuarios';

function CreateOrderModal({ onClose, onOrderCreated }) {
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [order, setOrder] = useState({
        ID_users: '',  
        OrderDate: new Date().toISOString().split('T')[0], 
        details: []
    });
    const [selectProduct, setSelectProduct] = useState('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Cargar productos
                const responseProducts = await axios.get(API_PRODUCTOS);
                setProducts(responseProducts.data);
                
                // Cargar usuarios
                const responseUsers = await axios.get(API_USUARIOS);
                setUsers(responseUsers.data);
            } catch (error) {
                console.error('Error al cargar datos:', error);
            }
        };
        loadData();
    }, []);

    const handleUserChange = (e) => {
        setOrder({
            ...order,
            ID_users: e.target.value
        });
    };

    const addProduct = () => {
        if (!selectProduct || quantity < 1) return;

        const product = products.find(p => p.id === parseInt(selectProduct));
        if (!product) return;

        setOrder(prevOrder => ({
            ...prevOrder,
            details: [...prevOrder.details, { 
                ID_product: product.id, 
                RequestedQuantity: quantity,
                ProductName: product.ProductName,
                UnityPrice: product.UnityPrice 
            }]
        }));

        setSelectProduct('');
        setQuantity(1);
    };

    const deleteProduct = (index) => {
        setOrder(prevOrder => ({
            ...prevOrder,
            details: prevOrder.details.filter((_, i) => i !== index)
        }));
    };

    const createOrder = async () => {
        if (!order.ID_users) {
            alert('Debe seleccionar un usuario');
            return;
        }

        if (order.details.length === 0) {
            alert('Debe agregar al menos un producto al pedido');
            return;
        }

        const orderData = {
            ...order,
            ID_users: parseInt(order.ID_users),
            OrderDate: new Date().toISOString().split('T')[0] 
        };

        try {
            await axios.post(API_PEDIDOS, orderData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            alert('Pedido creado exitosamente');
            onOrderCreated();
            onClose();
            setOrder({
                ID_users: '',  
                OrderDate: new Date().toISOString().split('T')[0],
                details: []
            });

        } catch (error) {
            console.error('Error al crear pedido:', error.response?.data || error);
            alert('Error al crear el pedido: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">Crear Nuevo Pedido</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {/* Sección de selección de usuario */}
                        <div className="mb-4">
                            <label htmlFor="Id_Users" className="form-label">Seleccionar Usuario</label>
                            <select 
                                className="form-select form-select-lg"
                                id='Id_Users'
                                value={order.ID_users}
                                onChange={handleUserChange}
                                required
                            >
                                <option value="">Seleccionar usuario</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name1} {user.name2}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sección de selección de productos */}
                        <div className="row mb-4">
                            <div className="col-md-8">
                                <label htmlFor="ID_product" className="form-label">Seleccionar Producto</label>
                                <select 
                                    className="form-select form-select-lg"
                                    id='ID_product'
                                    value={selectProduct} 
                                    onChange={(e) => setSelectProduct(e.target.value)}
                                >
                                    <option value="">Seleccionar producto</option>
                                    {products.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.ProductName} (Stock: {product.CurrentStock})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="Quantity" className="form-label">Quantity</label>
                                <input 
                                    type="number"
                                    id='Quantity'
                                    className="form-control form-control-lg"
                                    value={quantity} 
                                    onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)} 
                                    min="1"
                                />
                            </div>
                            <div className="col-md-1 d-flex align-items-end">
                                <button 
                                    onClick={addProduct} 
                                    className="btn btn-primary btn-lg"
                                    disabled={!selectProduct}
                                >
                                    <i className="bi bi-plus"></i>
                                </button>
                            </div>
                        </div>

                        {/* Detalles del pedido */}
                        <div className="mb-4">
                            <h5>Detalles del Pedido</h5>
                            {order.details.length === 0 ? (
                                <div className="alert alert-info">No hay productos agregados</div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th>Cantidad</th>
                                                <th>Precio Unitario</th>
                                                <th>Subtotal</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.details.map((detail, index) => (
                                                <tr key={index}>
                                                    <td>{detail.ProductName || `Producto ID: ${detail.ID_product}`}</td>
                                                    <td>{detail.RequestedQuantity}</td>
                                                    <td>${detail.UnityPrice?.toFixed(2) || '0.00'}</td>
                                                    <td>${((detail.UnityPrice || 0) * detail.RequestedQuantity).toFixed(2)}</td>
                                                    <td>
                                                        <button 
                                                            onClick={() => deleteProduct(index)}
                                                            className="btn btn-danger btn-sm"
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan="3" className="text-end fw-bold">Total:</td>
                                                <td className="fw-bold">
                                                    ${order.details.reduce((sum, item) => 
                                                        sum + (item.UnityPrice || 0) * item.RequestedQuantity, 0
                                                    ).toFixed(2)}
                                                </td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={onClose}
                        >
                            Cerrar
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-primary" 
                            onClick={createOrder}
                            disabled={order.details.length === 0 || !order.ID_users}
                        >
                            Guardar Pedido
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateOrderModal;