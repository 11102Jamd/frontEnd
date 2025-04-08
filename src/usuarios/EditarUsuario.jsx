import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_USUARIO = 'http://localhost:8000/api/usuarios/';

function EditarUsuarioModal({ usuario, onClose, onUsuarioActualizado }) {
    const [formData, setFormData] = useState({
        name1: '',
        name2: '',
        surname1: '',
        surname2: '',
        email: '',
        rol: '',
        password: '' 
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (usuario) {
            setFormData({
                name1: usuario.name1 || '',
                name2: usuario.name2 || '',
                surname1: usuario.surname1 || '',
                surname2: usuario.surname2 || '',
                email: usuario.email || '',
                rol: usuario.rol || '',
                password: ''
            });
        }
    }, [usuario]);

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
                name1: formData.name1,
                name2: formData.name2,
                surname1: formData.surname1,
                surname2: formData.surname2,
                email: formData.email,
                rol: formData.rol,
                ...(formData.password && { password: formData.password })
            };

            const response = await axios.put(`${API_USUARIO}${usuario.id}`, payload);
            onUsuarioActualizado();
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
                <h2>Editar Usuario</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input type="text" name="name1" value={formData.name1} onChange={handleChange} placeholder="Primer Nombre" className={errors.name1 ? 'error-field' : ''}/>
                        {errors.name1 && <div className="error-message">{errors.name1[0]}</div>}
                    </div>
                    
                    <div className="form-group">
                        <input type="text" name="name2" value={formData.name2} onChange={handleChange} placeholder="Segundo Nombre"/>
                    </div>
                    
                    <div className="form-group">
                        <input type="text" name="surname1" value={formData.surname1} onChange={handleChange} placeholder="Primer Apellido" className={errors.surname1 ? 'error-field' : ''}/>
                        {errors.surname1 && <div className="error-message">{errors.surname1[0]}</div>}
                    </div>
                    
                    <div className="form-group">
                        <input type="text" name="surname2" value={formData.surname2} onChange={handleChange} placeholder="Segundo Apellido" />
                    </div>
                    
                    <div className="form-group">
                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Correo" className={errors.email ? 'error-field' : ''}/>
                        {errors.email && <div className="error-message">{errors.email[0]}</div>}
                    </div>
                    
                    <div className="form-group">
                        <select name="rol"value={formData.rol} onChange={handleChange}className={errors.rol ? 'error-field' : ''}>
                            <option value="">Selecciona un rol</option>
                            <option value="Administrador">Administrador</option>
                            <option value="Panadero">Panadero</option>
                            <option value="Cajero">Cajero</option>
                        </select>
                        {errors.rol && <div className="error-message">{errors.rol[0]}</div>}
                    </div>
                    
                    <div className="form-group">
                        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Nueva contraseña (dejar vacío para no cambiar)" className={errors.password ? 'error-field' : ''}/>
                        {errors.password && <div className="error-message">{errors.password[0]}</div>}
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

export default EditarUsuarioModal;