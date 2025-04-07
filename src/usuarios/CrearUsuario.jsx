import React, { useState } from 'react';
import axios from 'axios';

const API_USUARIO = 'http://localhost:8000/api/usuarios';

function CrearUsuarioModal({ onClose, onUsuarioCreado }) {
    const [nuevoUsuario, setNuevoUsuario] = useState({
        name1: '',
        name2: '',
        surname1: '',
        surname2: '',
        email: '',
        password: '',
        rol: ''
    });

    const crearUsuario = async () => {
        try {
            await axios.post(API_USUARIO, nuevoUsuario);
            onUsuarioCreado();
            onClose();
            setNuevoUsuario({
                name1: '',
                name2: '',
                surname1: '',
                surname2: '',
                email: '',
                password:'',
                rol: ''
            });
        } catch (error) {
            console.error('Error al crear el usuario:', error);
        }
    };

    return (
        <div className="form-modal">
            <h2>Crear Usuario</h2>
            <input type="text" name="name1" placeholder="Primer Nombre" value={nuevoUsuario.name1} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, name1: e.target.value })} required />
            <br />
            <input type="text" name="name2" placeholder="Segundo Nombre" value={nuevoUsuario.name2} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, name2: e.target.value })} required />
            <br />
            <input type="text" name="surname1" placeholder="Primer Apellido" value={nuevoUsuario.surname1} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, surname1: e.target.value })} required />
            <br />
            <input type="text" name="surname2" placeholder="Segundo Apellido" value={nuevoUsuario.surname2} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, surname2: e.target.value })} required />
            <br />
            <input type="email" name="email" placeholder="Correo" value={nuevoUsuario.email} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })} required />
            <br />
            <input type="password" name="password" placeholder="password" value={nuevoUsuario.password} onChange={(e) => setNuevoUsuario({...nuevoUsuario, password: e.target.value })} required/>
            <br />
            <select value={nuevoUsuario.rol} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })}>
                <option value="">Selecciona un rol</option>
                <option value="Administrador">Administrador</option>
                <option value="Panadero">Panadero</option>
                <option value="Cajero">Cajero</option>
            </select>
            <br />
            <button onClick={crearUsuario} className='button-save'>Guardar</button>
            <button onClick={onClose} className='button-close'>Cerrar</button>
        </div>
    );
}

export default CrearUsuarioModal;
