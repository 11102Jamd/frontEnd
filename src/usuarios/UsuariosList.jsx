import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import CreateUserModal from './CrearUsuario';
import EditarUsuarioModal from './EditarUsuario';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap CSS


const API_USUARIO = 'http://localhost:8000/api/usuarios';

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [pending, setPending] = useState(true);

    useEffect(() => {
        obtenerUsuarios();
    }, []);

    const obtenerUsuarios = async () => {
        try {
            setPending(true);
            const response = await axios.get(API_USUARIO);
            setUsuarios(response.data);
            setPending(false);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            setPending(false);
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

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#343a40', 
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
            },
        },
        rows: {
            style: {
                minHeight: '50px',
                '&:nth-child(even)': {
                    backgroundColor: '#f8f9fa', // Color claro alterno
                },
                '&:hover': {
                    backgroundColor: '#e9ecef !important', // Color hover
                },
            },
        },
        pagination: {
            style: {
                backgroundColor: '#f8f9fa',
                borderTop: '1px solid #dee2e6',
            },
        },
    };

    const columnas = [
        {
            name: 'Primer Nombre',
            selector: row => row.name1,
            sortable: true,
        },
        {
            name: 'Segundo Nombre',
            selector: row => row.name2,
            sortable: true,
        },
        {
            name: 'Primer Apellido',
            selector: row => row.surname1,
            sortable: true,
        },
        {
            name: 'Segundo Apellido',
            selector: row => row.surname2,
            sortable: true,
        },
        {
            name: 'Correo',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Rol',
            selector: row => row.rol,
            sortable: true,
        },
        {
            name: 'Acciones',
            cell: row => (
                <div className="btn-group" role="group">
                    <button 
                        onClick={() => eliminarUsuarios(row.id)} 
                        className='btn btn-danger btn-sm'
                    >
                        Eliminar
                    </button>
                    <button 
                        onClick={() => {
                            console.log('Editando usuario:', row); 
                            setUsuarioSeleccionado(row);
                        }} 
                        className='btn btn-primary btn-sm ms-2'
                    >
                        Editar
                    </button>
                </div>
            ),
            ignoreRowClick: true,
        },
    ];

    const paginationOptions = {
        rowsPerPageText: 'Registros por página:',
        rangeSeparatorText: 'de',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Todos',
        noRowsPerPage: false,
    };

    return (
        <div className='container mt-4'>
            <div className='card'>
                <div className='card-header bg-primary text-white'>
                    <h1 className='h4'>Gestión de Usuarios</h1>
                </div>

                <div className='card-body'>
                    <div className='d-flex justify-content-between mb-3'>
                        <button 
                            onClick={() => setMostrarModal(true)} 
                            className='btn btn-success'
                        >
                            <i className="bi bi-plus-circle"></i> Crear Usuario
                        </button>
                    </div>

                    <DataTable
                        title="Lista de Usuarios"
                        columns={columnas}
                        data={usuarios}
                        pagination
                        paginationPerPage={5} 
                        paginationRowsPerPageOptions={[5, 10, 15, 20]} 
                        paginationComponentOptions={paginationOptions}
                        highlightOnHover
                        pointerOnHover
                        responsive
                        striped
                        customStyles={customStyles}
                        progressPending={pending}
                        progressComponent={<div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>}
                        noDataComponent={<div className="alert alert-info">No hay usuarios registrados</div>}
                    />
                </div>
            </div>

            {mostrarModal && (
                <CreateUserModal
                    onClose={() => setMostrarModal(false)}
                    onUserCreated={obtenerUsuarios}
                />
            )}

            {usuarioSeleccionado && (
                <EditarUsuarioModal
                    user={usuarioSeleccionado}
                    onClose={() => setUsuarioSeleccionado(null)}
                    onUserUpdated={obtenerUsuarios}
                />
            )}
        </div>
    );
}

export default Usuarios;