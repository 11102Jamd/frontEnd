import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_INSUMOS = 'http://localhost:8000/api/insumos';

function EditarInsumoModal({ insumo, onClose, onInsumoActualizado }) {
    const [formData, setFormData] = useState({
        InputName: '',
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (insumo) {
            setFormData({
                InputName: insumo.InputName || '',
            });
        }
    }, [insumo]);

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
                InputName: formData.InputName || '',
            };

            const response = await axios.put(`${API_INSUMOS}/${insumo.id}`, payload);
            onInsumoActualizado();
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
                    <input type="text" name="InputName" value={formData.InputName} onChange={handleChange} placeholder="Nombre" className={errors.name1 ? 'error-field' : ''}/>
                    {errors.name && <div className="error-message">{errors.name[0]}</div>}
                
                    <button type="submit" className="button-save">Guardar Cambios</button>
                    <button type="button" onClick={onClose} className="button-close">Cancelar</button>
                </form>
            </div>
        </div>
    );
}

export default EditarInsumoModal;