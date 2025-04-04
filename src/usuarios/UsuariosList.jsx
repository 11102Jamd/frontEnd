import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CrearUsuarioModal from './CrearUsuario';

const API_USUARIO = 'http://localhost:8000/api/usuarios';

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);

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
        <div>
            <h1>Gestión de Usuarios</h1>
            <button onClick={() => setMostrarModal(true)}>Crear Usuario</button>

            <h2>Lista Usuarios</h2>
            <table border="1">
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
                                <button onClick={() => eliminarUsuarios(producto.id)}>Eliminar</button>
                            </td>
                            <td>
                                <button>Editar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {mostrarModal && (
                <CrearUsuarioModal
                    onClose={() => setMostrarModal(false)}
                    onUsuarioCreado={obtenerUsuarios}
                />
            
            )}
        </div>
    );
}

export default Usuarios;