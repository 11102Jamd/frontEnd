import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CrearInsumoModal from './CrearInsumo';
import EditarInsumoModal from './EditarInusmo';

const API_INSUMOS = 'http://localhost:8000/api/insumos';

function Insumos() {
    const [insumo, setInsumos] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [paginaActual, setPaginaActual] = useState(1);
    const [insumoSeleccionado, setInsumoSeleccionado] = useState(null);
    const insumosPorPagina = 5;

    useEffect(() => {
        obtenerInsumos();
    }, []);

    const obtenerInsumos = async () => {
        try {
            const response = await axios.get(API_INSUMOS);
            setInsumos(response.data);
        } catch (error) {
            console.error('Error al obtener los Insumos:', error);
        }
    };

    const eliminarInsumos = async (id) => {
        try {
            await axios.delete(`${API_INSUMOS}/${id}`);
            obtenerInsumos();
        } catch (error) {
            console.error('Error al eliminar el Insumo:', error);
        }
    };

    const indiceUltimoInsumo = paginaActual * insumosPorPagina;
    const indicePrimerInsumo = indiceUltimoInsumo - insumosPorPagina;
    const insumosActuales = insumo.slice(indicePrimerInsumo, indiceUltimoInsumo);
    const totalPaginas = Math.ceil(insumo.length / insumosPorPagina);

    const cambiarPagina = (numeroPagina) => {
        setPaginaActual(numeroPagina);
    };

    return (
        <div>
            <h1>Gestión de Insumos</h1>
            <button onClick={() => setMostrarModal(true)} className='button-new'>Crear Insumo</button>

            <h2>Lista de Insumos</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Nombre Insumo</th>
                        <th>Cantidad Inicial</th>
                        <th>Unidad de Medida</th>
                        <th>Stock Actual</th>
                        <th>Gramos</th>
                        <th>Precio Unidad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {insumosActuales.map((insumo) => (
                        <tr key={insumo.id}>
                            <td>{insumo.InputName}</td>
                            <td>{insumo.InitialQuantity}</td>
                            <td>{insumo.UnitMeasurement}</td>
                            <td>{insumo.CurrentStock}</td>
                            <td>{insumo.UnitMeasurementGrams}</td>
                            <td>{insumo.UnityPrice} $</td>
                            <td>
                                <button onClick={() => eliminarInsumos(insumo.id)} className='button-danger'>Eliminar</button>
                                <button onClick={() => setInsumoSeleccionado(insumo)} className='button-edit'>Editar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="paginacion">
                {Array.from({ length: totalPaginas }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => cambiarPagina(i + 1)}
                        className={paginaActual === i + 1 ? 'pagina-activa' : ''}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            {mostrarModal && (
                <CrearInsumoModal
                    onClose={() => setMostrarModal(false)}
                    onInsumoCreado={obtenerInsumos}
                />
            )}

            {insumoSeleccionado && (
                <EditarInsumoModal
                    insumo={insumoSeleccionado}
                    onClose={() => setInsumoSeleccionado(null)}
                    onInsumoActualizado={obtenerInsumos}
                />
            )}
        </div>
    );
}

export default Insumos;
