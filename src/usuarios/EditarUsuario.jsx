import React, { useState } from 'react';
import axios from 'axios';

const API_USUARIO = 'http://localhost:8000/api/usuarios';

function EditarUsuarioModal({ user, onClose, onUserUpdated }) {
    const [userUpdate, setUserUpdate] = useState(user);

    const updateUser = async () => {
        try {
            await axios.put(`${API_USUARIO}/${user.id}`, userUpdate);
            onUserUpdated();
            onClose();
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
        }
    };

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">Editar Usuario</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label">Primer Nombre</label>
                            <input 
                                type="text" 
                                className="form-control form-control-lg" 
                                value={userUpdate.name1} 
                                onChange={(e) => setUserUpdate({ ...userUpdate, name1: e.target.value })} 
                                required 
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="name2" className="form-label">Segundo Nombre</label>
                            <input 
                                type="text" 
                                className="form-control form-control-lg" 
                                id="name2" 
                                value={userUpdate.name2} 
                                onChange={(e) => setUserUpdate({ ...userUpdate, name2: e.target.value })} 
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="surname1" className="form-label">Primer Apellido</label>
                            <input 
                                type="text" 
                                className="form-control form-control-lg" 
                                id="surname1" 
                                value={userUpdate.surname1} 
                                onChange={(e) => setUserUpdate({ ...userUpdate, surname1: e.target.value })} 
                                required 
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="surname2" className="form-label">Segundo Apellido</label>
                            <input 
                                type="text" 
                                className="form-control form-control-lg" 
                                id="surname2" 
                                value={userUpdate.surname2} 
                                onChange={(e) => setUserUpdate({ ...userUpdate, surname2: e.target.value })} 
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Correo Electrónico</label>
                            <input 
                                type="email" 
                                className="form-control form-control-lg" 
                                id="email" 
                                value={userUpdate.email} 
                                onChange={(e) => setUserUpdate({ ...userUpdate, email: e.target.value })} 
                                required 
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label htmlFor="rol" className="form-label">Rol</label>
                            <select 
                                className="form-select form-select-lg" 
                                id="rol" 
                                value={userUpdate.rol} 
                                onChange={(e) => setUserUpdate({ ...userUpdate, rol: e.target.value })}
                                required
                            >
                                <option value="">Selecciona un rol</option>
                                <option value="Administrador">Administrador</option>
                                <option value="Panadero">Panadero</option>
                                <option value="Cajero">Cajero</option>
                            </select>
                        </div>
                        
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="button" className="btn btn-primary" onClick={updateUser}>
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditarUsuarioModal;