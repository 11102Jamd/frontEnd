import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_FABRICACION = 'http://localhost:8000/api/fabricacion';
const API_PRODUCTOS = 'http://localhost:8000/api/productos';
const API_INSUMOS = 'http://localhost:8000/api/insumos';

function CrearFabricacionModal({ onClose, onFabricacionCreada }) {
    const [productos, setProductos] = useState([]);
    const [insumos, setInsumos] = useState([]);

    const [fabricacion, setFabricacion] = useState({
        ID_product: '',
        ManufacturingTime: '',
        recipes: []
    });

    const [nuevaReceta, setNuevaReceta] = useState({
        ID_inputs: '',
        AmountSpent: '',
        UnitMeasurement: 'g'
    });

    const [insumoSeleccionado, setInsumoSeleccionado] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resProductos, resInsumos] = await Promise.all([
                    axios.get(API_PRODUCTOS),
                    axios.get(API_INSUMOS)
                ]);
                setProductos(resProductos.data);
                setInsumos(resInsumos.data);
            } catch (error) {
                console.error("Error cargando datos:", error);
            }
        };
        fetchData();
    }, []);

    const handleFabricacionChange = (e) => {
        setFabricacion({ ...fabricacion, [e.target.name]: e.target.value });
    };

    const handleRecetaChange = (e) => {
        setNuevaReceta({ ...nuevaReceta, [e.target.name]: e.target.value });
    };

    const handleSelectInsumo = (e) => {
        const selectedId = e.target.value;
        const insumo = insumos.find(i => i.id === parseInt(selectedId));
        setInsumoSeleccionado(insumo);
        setNuevaReceta({ ...nuevaReceta, ID_inputs: selectedId });
    };

    const agregarReceta = () => {
        if (!nuevaReceta.ID_inputs || !nuevaReceta.AmountSpent || !nuevaReceta.UnitMeasurement) {
            alert("Todos los campos del insumo son obligatorios.");
            return;
        }

        const recetaToAdd = {
            ...nuevaReceta,
            AmountSpent: parseFloat(nuevaReceta.AmountSpent)
        };

        setFabricacion({
            ...fabricacion,
            recipes: [...fabricacion.recipes, recetaToAdd]
        });

        setNuevaReceta({
            ID_inputs: '',
            AmountSpent: '',
            UnitMeasurement: 'g'
        });
        setInsumoSeleccionado(null);
    };

    const eliminarReceta = (index) => {
        const nuevas = [...fabricacion.recipes];
        nuevas.splice(index, 1);
        setFabricacion({ ...fabricacion, recipes: nuevas });
    };

    const enviarFabricacion = async () => {
        if (!fabricacion.ID_product || !fabricacion.ManufacturingTime || fabricacion.recipes.length === 0) {
            alert("Faltan datos obligatorios o insumos.");
            return;
        }

        try {
            await axios.post(API_FABRICACION, fabricacion);
            alert("Fabricación creada exitosamente");
            onFabricacionCreada?.();
            onClose();
        } catch (error) {
            console.error("Error al crear fabricación:", error.response?.data || error.message);
            alert(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="form-modal">
            <h2>Crear Fabricación</h2>

            <label>Producto a fabricar:</label>
            <select name="ID_product" value={fabricacion.ID_product} onChange={handleFabricacionChange}>
                <option value="">Seleccione un producto</option>
                {productos.map(prod => (
                    <option key={prod.id} value={prod.id}>
                        {prod.ProductName || prod.name}
                    </option>
                ))}
            </select>

            <label>Tiempo de fabricación (minutos):</label>
            <input type="number" name="ManufacturingTime" value={fabricacion.ManufacturingTime} onChange={handleFabricacionChange} />

            <hr />

            <h3>Agregar Insumos (Receta)</h3>

            <label>Insumo:</label>
            <select value={nuevaReceta.ID_inputs} onChange={handleSelectInsumo}>
                <option value="">Seleccione un insumo</option>
                {insumos.map(insumo => (
                    <option key={insumo.id} value={insumo.id}>
                        {insumo.InputName}
                    </option>
                ))}
            </select>

            <label>Cantidad a usar:</label>
            <input type="number" name="AmountSpent" value={nuevaReceta.AmountSpent} onChange={handleRecetaChange} />

            <label>Unidad de medida:</label>
            <select name="UnitMeasurement" value={nuevaReceta.UnitMeasurement} onChange={handleRecetaChange}>
                <option value="g">g</option>
            </select>

            {insumoSeleccionado && (
                <div>
                    <p><strong>Stock disponible:</strong> {insumoSeleccionado.CurrentStock} g</p>
                    <p><strong>Unidad de medida:</strong> {insumoSeleccionado.UnitMeasurement}</p>
                </div>
            )}

            <button onClick={agregarReceta} className="button-sum">Añadir a receta</button>

            <h3>Receta actual</h3>
            {fabricacion.recipes.map((item, index) => (
                <div key={index}>
                    <span>Insumo ID: {item.ID_inputs} - {item.AmountSpent} {item.UnitMeasurement}</span>
                    <button onClick={() => eliminarReceta(index)}>Eliminar</button>
                </div>
            ))}

            <hr />
            <button onClick={enviarFabricacion} className="button-save">Guardar Fabricación</button>
            <button onClick={onClose} className="button-close">Cancelar</button>
        </div>
    );
}

export default CrearFabricacionModal;
