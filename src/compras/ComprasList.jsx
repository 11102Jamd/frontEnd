import React, { useState, useEffect } from "react";
import axios from "axios";
import CrearOrdenModal from "./CrearCompra";


const API_COMPRAS = 'http://localhost:8000/api/compras';

function Compras(){
    const [compras, setCompras] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);

    useEffect(() => {
        obtenerCompras();
    }, []);

    const obtenerCompras = async () => {
        try {
            const response = await axios.get(API_COMPRAS);
            setCompras(response.data);
        } catch (error) {
            console.error('Error al obtener las compras:', error);
        }
    }

    const eliminarCompra = async (id) => {
        try {
            await axios.delete(`${API_COMPRAS}/${id}`);
            obtenerCompras(); 
        } catch (error) {
            console.error('Error al eliminar compra:', error);
        }
    };
    

    return (
        <div>
            <h1>Gestión de Compras</h1>
            <button onClick={() => setMostrarModal(true)}>Crear Compra</button>

            <h2>Lista de Compras</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>ID Proveedor</th>
                        <th>Fecha Orden de Compra</th>
                        <th>Total de la Orden</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {compras.map((compras) => (
                        <tr key={compras.id}>
                            <td>{compras.ID_supplier}</td>
                            <td>{compras.PurchaseOrderDate}</td>
                            <td>{compras.PurchaseTotal}</td>
                            <td>
                                <button onClick={() => eliminarCompra(compras.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {mostrarModal && (
                <CrearOrdenModal
                    onClose={() => setMostrarModal(false)}
                    onOrdenCreada={obtenerCompras}
                />
            )}
        </div>
    );
}

export default Compras;