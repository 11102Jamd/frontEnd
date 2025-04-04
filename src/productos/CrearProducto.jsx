import React, { useState } from 'react';
import axios from 'axios';

const API_PRODUCTOS = 'http://localhost:8000/api/productos';

function CrearProductoModal({ onClose, onProductoCreado }) {
    const [nuevoProducto, setNuevoProducto] = useState({
        ProductName: '',
        InitialQuantity: '',
        CurrentStock: '',
        UnityPrice: ''
    });

    const crearProducto = async () => {
        try {
            await axios.post(API_PRODUCTOS, nuevoProducto);
            onProductoCreado();
            onClose();
            setNuevoProducto({
                ProductName: '',
                InitialQuantity: '',
                CurrentStock: '',
                UnityPrice: ''
            });
        } catch (error) {
            console.error('Error al crear el producto:', error);
        }
    };

    return (
        <div className="modal">
            <h2>Crear Producto</h2>
            <input type="text" name="ProductName" placeholder="Nombre Producto" value={nuevoProducto.ProductName} onChange={(e) => setNuevoProducto({ ...nuevoProducto, ProductName: e.target.value })} required/>
            <br />
            <input type="number" name="InitialQuantity" placeholder="Cantidad Inicial" value={nuevoProducto.InitialQuantity} onChange={(e) => setNuevoProducto({ ...nuevoProducto, InitialQuantity: e.target.value })} required/>
            <br />
            <input type="number" name="CurrentStock" placeholder="Stock Actual" value={nuevoProducto.CurrentStock} onChange={(e) => setNuevoProducto({ ...nuevoProducto, CurrentStock: e.target.value })} required/>
            <br />
            <input type="number" name="UnityPrice" placeholder="Precio Unidad" value={nuevoProducto.UnityPrice} onChange={(e) => setNuevoProducto({ ...nuevoProducto, UnityPrice: e.target.value })} required/>
            <br />
            <button onClick={crearProducto}>Guardar</button>
            <button onClick={onClose}>Cerrar</button>
        </div>
    );
}

export default CrearProductoModal;
