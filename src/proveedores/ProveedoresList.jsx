import React, { useEffect, useState } from "react";
import axios from "axios";
import CrearProveedorModal from "./CrearProveedor";
import EditarProveedorModal from "./EditarProveedor";


const API_PROVEEDOR = 'http://localhost:8000/api/proveedores';

function Proveedor(){
    const [proveedores, setProveedor] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);

    useEffect(() => {
        obtenerProveedor();
    }, []);

    const obtenerProveedor = async () => {
        try {
            const response = await axios.get(API_PROVEEDOR);
            setProveedor(response.data);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }
    };

    const eliminarProveedor = async () => {
        try {
            await axios.delete(`${API_PROVEEDOR}/${id}`);
            obtenerProveedor();
        } catch (error) {
            console.error("Error al eliminar el proveedor");
        }
    };

    return(
        <div>
            <h1>Gestión de Proveedores</h1>
            <button onClick={() => setMostrarModal(true)} className="button-new">Crear Proveedor</button>

            <h2>Lista de Provedores</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Direccion</th>
                        <th>Telefono</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {proveedores.map((proveedores) => (
                        <tr key={proveedores.id}>
                            <td>{proveedores.name}</td>
                            <td>{proveedores.email}</td>
                            <td>{proveedores.Addres}</td>
                            <td>{proveedores.Phone}</td>
                            <td>
                                <button onClick={() => eliminarProveedor(proveedores.id)} className="button-danger">Eliminar</button>
                                <button onClick={() => setProveedorSeleccionado(proveedores)} className='button-edit'>Editar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {mostrarModal && (
                <CrearProveedorModal
                onClose={() => setMostrarModal(false)}
                onProveedorCreado={obtenerProveedor}
                />
            )}

            {proveedorSeleccionado && (
                <EditarProveedorModal
                    proveedor={proveedorSeleccionado}
                    onClose={() => setProveedorSeleccionado(null)}
                    onProveedorActualizado={obtenerProveedor}
                />
            )}
        </div>
    );
}

export default Proveedor;