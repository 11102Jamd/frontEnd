import React, { useState } from 'react';
import axios from 'axios';

const API_USUARIO = 'http://localhost:8000/api/usuarios';

function CreateUserModal({ onClose, onUserCreated }) {
    const [newUser, setNewUser] = useState({
        name1: '',
        name2: '',
        surname1: '',
        surname2: '',
        email: '',
        password: '',
        rol: ''
    });

    const createUser = async () => {
        try {
            await axios.post(API_USUARIO, newUser);
            onUserCreated();
            onClose();
            setNewUser({
                name1: '',
                name2: '',
                surname1: '',
                surname2: '',
                email: '',
                password: '',
                rol: ''
            });
        } catch (error) {
            console.error('Error al crear el usuario:', error);
        }
    };

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">Crear Nuevo Usuario</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label htmlFor="name1" className="form-label">Primer Nombre</label>
                            <input 
                                type="text" 
                                className="form-control form-control-lg" 
                                id="name1" 
                                value={newUser.name1} 
                                onChange={(e) => setNewUser({ ...newUser, name1: e.target.value })} 
                                required 
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="name2" className="form-label">Segundo Nombre</label>
                            <input 
                                type="text" 
                                className="form-control form-control-lg" 
                                id="name2" 
                                value={newUser.name2} 
                                onChange={(e) => setNewUser({ ...newUser, name2: e.target.value })} 
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="surname1" className="form-label">Primer Apellido</label>
                            <input 
                                type="text" 
                                className="form-control form-control-lg" 
                                id="surname1" 
                                value={newUser.surname1} 
                                onChange={(e) => setNewUser({ ...newUser, surname1: e.target.value })} 
                                required 
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="surname2" className="form-label">Segundo Apellido</label>
                            <input 
                                type="text" 
                                className="form-control form-control-lg" 
                                id="surname2" 
                                value={newUser.surname2} 
                                onChange={(e) => setNewUser({ ...newUser, surname2: e.target.value })} 
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Correo Electrónico</label>
                            <input 
                                type="email" 
                                className="form-control form-control-lg" 
                                id="email" 
                                value={newUser.email} 
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} 
                                required 
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Contraseña</label>
                            <input 
                                type="password" 
                                className="form-control form-control-lg" 
                                id="password" 
                                value={newUser.password} 
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} 
                                required 
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label htmlFor="rol" className="form-label">Rol</label>
                            <select 
                                className="form-select form-select-lg" 
                                id="rol" 
                                value={newUser.rol} 
                                onChange={(e) => setNewUser({ ...newUser, rol: e.target.value })}
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
                            Cerrar
                        </button>
                        <button type="button" className="btn btn-primary" onClick={createUser}>
                            Guardar Usuario
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateUserModal;