import React, { useEffect, useState } from "react";
import axios from "axios";
import CrearFabricacionModal from "./CrearFabricacion";

const API_FABRICACION = 'http://localhost:8000/api/fabricacion'
function Fabricacion(){
    const [fabricacion, setFabricacion] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);

    useEffect(() => {
        obtenerFabricacion();
    }, []);

    const obtenerFabricacion = async () => {
        try {
            const response = await axios.get(API_FABRICACION);
            setFabricacion(response.data);
        } catch (error) {
            console.error("Error al obtener las compras", error);
        }
    }

    const eliminarFabricacion = async () => {
        try {
            await axios.delete(`${API_FABRICACION}/${id}`);
            obtenerFabricacion();
        } catch (error) {
            console.error("Error al eliminar la fabricacion", error);
        }
    }
    return(
        <div>
            <h1>Fabricacion</h1>
            <button onClick={() => setMostrarModal(true)} className="button-new">Crear Compra</button>

            <h2>Lista de Fabricacion</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>ID Producto</th>
                        <th>Tiempo de Fabricacion</th>
                        <th>Mano de Obra</th>
                        <th>Producto Fabricado en G</th>
                        <th>Costo de Produccion</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {fabricacion.map((fabricacion) => (
                        <tr key={fabricacion.id}>
                            <td>{fabricacion.ID_product}</td>
                            <td>{fabricacion.ManufacturingTime}</td>
                            <td>{fabricacion.Labour}</td>
                            <td>{fabricacion.ManufactureProductG}</td>
                            <td>{fabricacion.TotalCostProduction}</td>
                            <td>
                                <button onClick={() => eliminarFabricacion(fabricacion.id)} className="button-danger">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {mostrarModal && (
                <CrearFabricacionModal
                    onClose={() => setMostrarModal(false)}
                    onFabricacionCreada={obtenerFabricacion}
                />
            )}
        </div>
    );
}
export default Fabricacion;