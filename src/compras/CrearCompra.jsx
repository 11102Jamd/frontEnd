import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_ORDENES = 'http://localhost:8000/api/compras';
const API_PROVEEDORES = 'http://localhost:8000/api/proveedores';

function CrearOrdenModal({ onClose, onOrdenCreada }) {
    const [proveedores, setProveedores] = useState([]);
    const [orden, setOrden] = useState({
        ID_supplier: '',
        PurchaseOrderDate: '',
        inputs: []
    });

    const [input, setInput] = useState({
        InputName: '',
        InitialQuantity: '',
        UnitMeasurement: '',
        CurrentStock: '',
        UnitMeasurementGrams: 'g',
        UnityPrice: ''
    });

    useEffect(() => {
        const obtenerProveedores = async () => {
            try {
                const response = await axios.get(API_PROVEEDORES);
                setProveedores(response.data);
            } catch (error) {
                console.error("Error al obtener proveedores:", error);
            }
        };
        obtenerProveedores();
    }, []);
    
    const agregarInput = () => {
        if (!input.InputName || !input.InitialQuantity || !input.UnitMeasurement || 
            !input.UnityPrice || !input.CurrentStock) {
            alert("Todos los campos del insumo son obligatorios.");
            return;
        }

        const inputToAdd = {
            ...input,
            InitialQuantity: parseFloat(input.InitialQuantity),
            CurrentStock: parseFloat(input.CurrentStock),
            UnityPrice: parseFloat(input.UnityPrice),
            UnitMeasurementGrams: 'g'
        };
        
        setOrden({ ...orden, inputs: [...orden.inputs, inputToAdd] });
        setInput({ 
            InputName: '', 
            InitialQuantity: '', 
            UnitMeasurement: '', 
            CurrentStock: '',
            UnitMeasurementGrams: 'g',
            UnityPrice: '' 
        });
    };

    const eliminarInput = (index) => {
        const nuevosInsumos = [...orden.inputs];
        nuevosInsumos.splice(index, 1);
        setOrden({ ...orden, inputs: nuevosInsumos });
    };

    const handleChange = (e) => {
        setOrden({ ...orden, [e.target.name]: e.target.value });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInput({
            ...input,
            [name]: value
        });
    };

    const enviarOrden = async () => {
        if (!orden.ID_supplier || !orden.PurchaseOrderDate || orden.inputs.length === 0) {
            alert("Todos los campos son obligatorios y debe agregar al menos un insumo.");
            return;
        }

        try {
            await axios.post(API_ORDENES, orden);
            alert("Orden creada exitosamente");
            
            if (typeof onOrdenCreada === 'function') {
                onOrdenCreada();
            }
            
            onClose();
        } catch (error) {
            console.error("Error al crear la orden:", error.response?.data || error.message);
            alert(`Error al crear la orden: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Crear Orden de Compra</h2>

                <div>
                    <label>Proveedor:</label>
                    <select name="ID_supplier" value={orden.ID_supplier} onChange={handleChange}>
                        <option value="">Seleccione un proveedor</option>
                        {proveedores.map(proveedor => (
                            <option key={proveedor.id} value={proveedor.id}>
                                {proveedor.nombre || proveedor.name || proveedor.razon_social} {/* Ajusta según tus datos */}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Fecha:</label>
                    <input type="date"  name="PurchaseOrderDate" value={orden.PurchaseOrderDate} onChange={handleChange}/>
                </div>

                <h3>Insumos:</h3>
                {orden.inputs.map((item, index) => (
                    <div key={index}>
                        <div>
                            <span>{item.InputName} - {item.InitialQuantity} {item.UnitMeasurement} - Stock: {item.CurrentStock} - ${item.UnityPrice}</span>
                        </div>
                        <button onClick={() => eliminarInput(index)}>
                            Eliminar
                        </button>
                    </div>
                ))}

                <h4>Agregar Insumo</h4>
                <div>
                    <div>
                        <label>Nombre:</label>
                        <input type="text" name="InputName" placeholder="Nombre" value={input.InputName} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Cantidad:</label>
                        <input type="number" name="InitialQuantity" placeholder="Cantidad" value={input.InitialQuantity} onChange={handleInputChange}/>
                    </div>
                    <div>
                        <label>Unidad de Medida:</label>
                        <select name="UnitMeasurement" value={input.UnitMeasurement} onChange={handleInputChange}>
                            <option value="">Seleccione unidad</option>
                            <option value="Kg">Kg</option>
                            <option value="lb">lb</option>
                            <option value="g">g</option>
                        </select>
                    </div>
                    <div>
                        <label>Stock Actual:</label>
                        <input type="number" name="CurrentStock" placeholder="Stock Actual" value={input.CurrentStock} onChange={handleInputChange}/>
                    </div>
                    <div>
                        <label>Unidad en Gramos:</label>
                        <input type="text" name="UnitMeasurementGrams" value="g"readOnly/>
                    </div>
                    <div>
                        <label>Precio Unitario:</label>
                        <input type="number" name="UnityPrice" placeholder="Precio" value={input.UnityPrice} onChange={handleInputChange} step="0.01"/>
                    </div>
                </div>
                <button onClick={agregarInput}>
                    Añadir Insumo
                </button>

                <div>
                    <button onClick={onClose}>
                        Cancelar
                    </button>
                    <button onClick={enviarOrden}>
                        Guardar Orden
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CrearOrdenModal;

