import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CrearUsuarioModal from './CrearUsuario';
import EditarUsuarioModal from './EditarUsuario';
import '../App.css';

const API_USUARIO = 'http://localhost:8000/api/usuarios';

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

    useEffect(() => {
        obtenerUsuarios();
    }, []);

    const obtenerUsuarios = async () => {
        try {
            const response = await axios.get(API_USUARIO);
            setUsuarios(response.data);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
        }
    };

    const eliminarUsuarios = async (id) => {
        try {
            await axios.delete(`${API_USUARIO}/${id}`);
            obtenerUsuarios();
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
        }
    };

    return (
        <div className='content-user'>
            <div className='content-list'>
                <div className='title'>
                    <h1>Gestión de Usuarios</h1>
                </div>
                
                <div className='subtitle'>
                    <h2>Lista de Usuarios</h2>
                </div>
                <div className='btn-new-user'>
                    <button onClick={() => setMostrarModal(true)} className='button-new'>Crear Usuario</button>
                </div>
                <div className='list'>
                    <table border="1" className='user-table'>
                        <thead>
                            <tr>
                                <th>Primer Nombre</th>
                                <th>Segundo Nombre</th>
                                <th>Primer Apellido</th>
                                <th>Segundo Apellido</th>
                                <th>Correo</th>
                                <th>rol</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((usuarios) => (
                                <tr key={usuarios.id}>
                                    <td>{usuarios.name1}</td>
                                    <td>{usuarios.name2}</td>
                                    <td>{usuarios.surname1}</td>
                                    <td>{usuarios.surname2}</td>
                                    <td>{usuarios.email}</td>
                                    <td>{usuarios.rol}</td>
                                    <td>
                                        <button onClick={() => eliminarUsuarios(usuarios.id)} className='button-danger'>Eliminar</button>
                                        <button onClick={() => setUsuarioSeleccionado(usuarios)} className='button-edit'>Editar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {mostrarModal && (
                    <CrearUsuarioModal
                        onClose={() => setMostrarModal(false)}
                        onUsuarioCreado={obtenerUsuarios}
                    />
                )}

                {usuarioSeleccionado && (
                    <EditarUsuarioModal
                        usuario={usuarioSeleccionado}
                        onClose={() => setUsuarioSeleccionado(null)}
                        onUsuarioActualizado={obtenerUsuarios}
                    />
                )}
            </div>
        </div>
    );
}

export default Usuarios;