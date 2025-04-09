import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_PROVEEDOR = 'http://localhost:8000/api/proveedores';

function EditarProveedorModal({ proveedor, onClose, onProveedorActualizado }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        Addres: '',
        Phone: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (proveedor) {
            setFormData({
                name: proveedor.name || '',
                email: proveedor.email || '',
                Addres: proveedor.Addres || '',
                Phone: proveedor.Phone || ''
            });
        }
    }, [proveedor]);

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
                name: formData.name,
                email: formData.email,
                Addres: formData.Addres,
                Phone: formData.Phone,
            };

            const response = await axios.put(`${API_PROVEEDOR}/${proveedor.id}`, payload);
            onProveedorActualizado();
            onClose();
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
                alert('Error de validación: ' + 
                    (error.response.data.message || 'Verifica los datos ingresados'));
            } else {
                console.error('Error al actualizar usuario:', error);
                alert('Error inesperado al actualizar el usuario');
            }
        }
    };

    return (
        <div className="modal">
            <div className="form-modal">
                <h2>Editar Proveedor</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nombre" className={errors.name1 ? 'error-field' : ''}/>
                        {errors.name && <div className="error-message">{errors.name[0]}</div>}
                    </div>

                    <div className="form-group">
                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Correo" className={errors.email ? 'error-field' : ''}/>
                        {errors.email && <div className="error-message">{errors.email[0]}</div>}
                    </div>

                    <div className="form-group">
                        <input type="text" name="Addres" value={formData.Addres} onChange={handleChange} placeholder="Direccion" className={errors.Addres ? 'error-field' : ''}/>
                        {errors.Addres && <div className="error-message">{errors.Addres[0]}</div>}
                    </div>
                    
                    <div className="form-group">
                        <input type="number" name="Phone" value={formData.Phone} onChange={handleChange} placeholder="Telefono" />
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

export default EditarProveedorModal;