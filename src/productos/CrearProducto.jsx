import React, { useState } from 'react';
import axios from 'axios';

const API_PRODUCTOS = 'http://localhost:8000/api/productos';

function CreateProductModal({ onClose, onProductCreated }) {
    const [newProduct, setNewProduct] = useState({
        ProductName: '',
        InitialQuantity: '',
        CurrentStock: '',
        UnityPrice: ''
    });

    const createProduct = async () => {
        try {
            await axios.post(API_PRODUCTOS, newProduct);
            onProductCreated();
            onClose();
            setNewProduct({
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
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">Crear Nuevo Producto</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label htmlFor="ProductName" className="form-label">Producto</label>
                            <input 
                                type="text" 
                                className="form-control form-control-lg" 
                                id="ProductName" 
                                value={newProduct.ProductName} 
                                onChange={(e) => setNewProduct({ ...newProduct, ProductName: e.target.value })} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="InitialQuantity" className="form-label">Cantidad Inicial</label>
                            <input 
                                type="number" 
                                className="form-control form-control-lg" 
                                id="InitialQuantity" 
                                value={newProduct.InitialQuantity} 
                                onChange={(e) => setNewProduct({ ...newProduct, InitialQuantity: e.target.value })} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="CurrentStock" className="form-label">Stock Actual</label>
                            <input 
                                type="number" 
                                className="form-control form-control-lg" 
                                id="CurrentStock" 
                                value={newProduct.CurrentStock} 
                                onChange={(e) => setNewProduct({ ...newProduct, CurrentStock: e.target.value })} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="UnityPrice" className="form-label">Precio por Unidad</label>
                            <input 
                                type="number" 
                                className="form-control form-control-lg" 
                                id="UnityPrice" 
                                value={newProduct.UnityPrice} 
                                onChange={(e) => setNewProduct({ ...newProduct, UnityPrice: e.target.value })} 
                                required 
                            />
                        </div>
                        
                        
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cerrar
                        </button>
                        <button type="button" className="btn btn-primary" onClick={createProduct}>
                            Guardar Producto
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateProductModal;
