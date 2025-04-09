import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_PRODUCTOS = 'http://localhost:8000/api/productos';

function EditarProductoModal({ producto, onClose, onProductoActualizado }) {
    const [formData, setFormData] = useState({
        ProductName: '',
        InitialQuantity: '',
        CurrentStock: '',
        UnityPrice: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (producto) {
            setFormData({
                ProductName: producto.ProductName || '',
                InitialQuantity: producto.InitialQuantity || '',
                CurrentStock: producto.CurrentStock || '',
                UnityPrice: producto.UnityPrice || ''
            });
        }
    }, [producto]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors(prev => {
                const newErrors = {...prev};
                delete newErrors[e.target.name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ProductName: formData.ProductName || '',
                InitialQuantity: formData.InitialQuantity,
                CurrentStock: formData.CurrentStock,
                UnityPrice: formData.UnityPrice,
            };

            const response = await axios.put(`${API_PRODUCTOS}/${producto.id}`, payload);
            onProductoActualizado();
            onClose();
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
                alert('Error de validación: ' + 
                    (error.response.data.message || 'Verifica los datos ingresados'));
            } else {
                console.error('Error al actualizar el proveedor:', error);
                alert('Error inesperado al actualizar el proveedor');
            }
        }
    };

    return (
        <div className="modal">
            <div className="form-modal">
                <h2>Editar Producto</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input type="text" name="ProductName" value={formData.ProductName} onChange={handleChange} placeholder="Nombre" className={errors.name1 ? 'error-field' : ''}/>
                        {errors.name && <div className="error-message">{errors.name[0]}</div>}
                    </div>
                    
                    <div className="form-group">
                        <input type="number" name="UnityPrice" value={formData.UnityPrice} onChange={handleChange} placeholder="Precio Unidad" />
                    </div>
                    
                    <div className="form-actions">
                        <button type="submit" className="button-save">Guardar Cambios</button>
                        <button type="button" onClick={onClose} className="button-close">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditarProductoModal;