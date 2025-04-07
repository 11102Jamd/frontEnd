import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_ORDENES = 'http://localhost:8000/api/compras';
const API_PROVEEDORES = 'http://localhost:8000/api/proveedores';
const API_INSUMOS = 'http://localhost:8000/api/insumos'; 

function CrearOrdenModal({ onClose, onOrdenCreada }) {
    const [proveedores, setProveedores] = useState([]);
    const [insumos, setInsumos] = useState([]);
    const [orden, setOrden] = useState({
        ID_supplier: '',
        PurchaseOrderDate: '',
        inputs: []
    });

    const [nuevoInsumo, setNuevoInsumo] = useState({
        ID_input: '',
        InitialQuantity: '',
        UnitMeasurement: 'Kg',
        UnityPrice: ''
    });

    const [insumoSeleccionado, setInsumoSeleccionado] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resProveedores, resInsumos] = await Promise.all([
                    axios.get(API_PROVEEDORES),
                    axios.get(API_INSUMOS)
                ]);
                setProveedores(resProveedores.data);
                setInsumos(resInsumos.data);
            } catch (error) {
                console.error("Error cargando datos:", error);
            }
        };
        fetchData();
    }, []);

    const handleSelectInsumo = (e) => {
        const selectedId = e.target.value;
        setNuevoInsumo({ ...nuevoInsumo, ID_input: selectedId });

        const insumo = insumos.find(i => i.id === parseInt(selectedId));
        setInsumoSeleccionado(insumo);
    };

    const agregarInput = () => {
        if (!nuevoInsumo.ID_input || !nuevoInsumo.InitialQuantity || !nuevoInsumo.UnitMeasurement || !nuevoInsumo.UnityPrice) {
            alert("Todos los campos del insumo son obligatorios.");
            return;
        }

        const inputToAdd = {
            ...nuevoInsumo,
            InitialQuantity: parseFloat(nuevoInsumo.InitialQuantity),
            UnityPrice: parseFloat(nuevoInsumo.UnityPrice)
        };

        setOrden({ ...orden, inputs: [...orden.inputs, inputToAdd] });

        setNuevoInsumo({
            ID_input: '',
            InitialQuantity: '',
            UnitMeasurement: 'Kg',
            UnityPrice: ''
        });
        setInsumoSeleccionado(null);
    };

    const eliminarInput = (index) => {
        const nuevos = [...orden.inputs];
        nuevos.splice(index, 1);
        setOrden({ ...orden, inputs: nuevos });
    };

    const handleOrdenChange = (e) => {
        setOrden({ ...orden, [e.target.name]: e.target.value });
    };

    const handleInsumoChange = (e) => {
        setNuevoInsumo({ ...nuevoInsumo, [e.target.name]: e.target.value });
    };

    const enviarOrden = async () => {
        if (!orden.ID_supplier || !orden.PurchaseOrderDate || orden.inputs.length === 0) {
            alert("Faltan datos obligatorios o insumos.");
            return;
        }

        try {
            await axios.post(API_ORDENES, orden);
            alert("Orden creada exitosamente");
            onOrdenCreada?.();
            onClose();
        } catch (error) {
            console.error("Error al crear orden:", error.response?.data || error.message);
            alert(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div>
            <div className="form-compras">
                <h2>Crear Orden de Compra</h2>

                <label>Proveedor:</label>
                <select name="ID_supplier" value={orden.ID_supplier} onChange={handleOrdenChange}>
                    <option value="">Seleccione un proveedor</option>
                    {proveedores.map(proveedor => (
                        <option key={proveedor.id} value={proveedor.id}>
                            {proveedor.nombre || proveedor.name || proveedor.razon_social}
                        </option>
                    ))}
                </select>

                <label>Fecha:</label>
                <input type="date" name="PurchaseOrderDate" value={orden.PurchaseOrderDate} onChange={handleOrdenChange} />
                
                <h2>Añadir Insumos</h2>

                <label>Seleccionar Insumo:</label>
                <select value={nuevoInsumo.ID_input} onChange={handleSelectInsumo}>
                    <option value="">Seleccione un insumo</option>
                    {insumos.map(insumo => (
                        <option key={insumo.id} value={insumo.id}>
                            {insumo.InputName}
                        </option>
                    ))}
                </select>

                <label>Cantidad a agregar:</label>
                <input type="number" name="InitialQuantity" value={nuevoInsumo.InitialQuantity} onChange={handleInsumoChange} />
            
                
                <label>Unidad:</label>
                <select name="UnitMeasurement" value={nuevoInsumo.UnitMeasurement} onChange={handleInsumoChange}>
                    <option value="g">g</option>
                    <option value="Kg">Kg</option>
                    <option value="lb">lb</option>
                </select>

                <label>Precio Unitario:</label>
                <input type="number" name="UnityPrice" value={nuevoInsumo.UnityPrice} onChange={handleInsumoChange} step="0.01" />

                <h3>Insumos Agregados</h3>
                {orden.inputs.map((item, index) => (
                    <div key={index}>
                        <span>ID: {item.ID_input} - Cantidad: {item.InitialQuantity} {item.UnitMeasurement} - Precio: ${item.UnityPrice}</span>
                        <button onClick={() => eliminarInput(index)}>Eliminar</button>
                    </div>
                ))}

                {insumoSeleccionado && (
                    <div>
                        <p><strong>Nombre:</strong> {insumoSeleccionado.InputName}</p>
                        <p><strong>Stock actual:</strong> {insumoSeleccionado.CurrentStock} g</p>
                        <p><strong>Unidad medida:</strong> {insumoSeleccionado.UnitMeasurement}</p>
                    </div>
                )}

                <button onClick={agregarInput} className='button-sum'>Añadir Insumo</button>
                <button onClick={onClose} className='button-close'>Cancelar</button>
                <button onClick={enviarOrden} className='button-save'>Guardar Orden</button>
            </div>
        </div>
    );
}

export default CrearOrdenModal;