import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_ORDENES = 'http://localhost:8000/api/compras';
const API_PROVEEDORES = 'http://localhost:8000/api/proveedores';
const API_INSUMOS = 'http://localhost:8000/api/insumos'; 

function CreatePurchaseOrderModal({ onClose, onPurchaseOrderCreated }) {
    const [suppliers, setSuppliers] = useState([]);
    const [inputs, setInputs] = useState([]);
    const [purchaseOrder, setPurchaseOrder] = useState({
        ID_supplier: '',
        PurchaseOrderDate: new Date().toISOString().split('T')[0],
        inputs: []
    });

    const [newInput, setNewInput] = useState({
        ID_input: '',
        InitialQuantity: '',
        UnitMeasurement: 'Kg',
        UnityPrice: ''
    });

    const [selectInput, setSelectInput] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [responseSuppliers, responseInputs] = await Promise.all([
                    axios.get(API_PROVEEDORES),
                    axios.get(API_INSUMOS)
                ]);
                setSuppliers(responseSuppliers.data);
                setInputs(responseInputs.data);
                setLoading(false);
            } catch (error) {
                console.error("Error cargando datos:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSelectInput = (e) => {
        const selectedId = e.target.value;
        setNewInput({ ...newInput, ID_input: selectedId });

        const input = inputs.find(i => i.id === parseInt(selectedId));
        setSelectInput(input);
    };

    const agregarInput = () => {
        if (!newInput.ID_input || !newInput.InitialQuantity || !newInput.UnitMeasurement || !newInput.UnityPrice) {
            alert("Todos los campos del insumo son obligatorios.");
            return;
        }

        const inputToAdd = {
            ...newInput,
            InputName: selectInput?.InputName || '',
            InitialQuantity: parseFloat(newInput.InitialQuantity),
            UnityPrice: parseFloat(newInput.UnityPrice)
        };

        setPurchaseOrder({ ...purchaseOrder, inputs: [...purchaseOrder.inputs, inputToAdd] });

        setNewInput({
            ID_input: '',
            InitialQuantity: '',
            UnitMeasurement: 'Kg',
            UnityPrice: ''
        });
        setSelectInput(null);
    };

    const eliminarInput = (index) => {
        const updatedInputs = [...purchaseOrder.inputs];
        updatedInputs.splice(index, 1);
        setPurchaseOrder({ ...purchaseOrder, inputs: updatedInputs });
    };

    const handleOrdenChange = (e) => {
        setPurchaseOrder({ ...purchaseOrder, [e.target.name]: e.target.value });
    };

    const handleInputChange = (e) => {
        setNewInput({ ...newInput, [e.target.name]: e.target.value });
    };

    const sendPurchaseOrder = async () => {
        if (!purchaseOrder.ID_supplier || !purchaseOrder.PurchaseOrderDate || purchaseOrder.inputs.length === 0) {
            alert("Faltan datos obligatorios o insumos.");
            return;
        }

        try {
            await axios.post(API_ORDENES, purchaseOrder);
            alert("Orden creada exitosamente");
            onPurchaseOrderCreated?.();
            onClose();
        } catch (error) {
            console.error("Error al crear orden:", error.response?.data || error.message);
            alert(`Error: ${error.response?.data?.message || error.message}`);
        }
    };
    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">Crear Orden de Compra</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {/* Sección de selección de proveedor */}
                        <div className="mb-4">
                            <label htmlFor="ID_supplier" className="form-label">Seleccionar Proveedor</label>
                            <select 
                                className="form-select form-select-lg"
                                id="ID_supplier"
                                name="ID_supplier"
                                value={purchaseOrder.ID_supplier}
                                onChange={handleOrdenChange}
                                required
                            >
                                <option value="">Seleccione un proveedor</option>
                                {suppliers.map(supplier => (
                                    <option key={supplier.id} value={supplier.id}>
                                        {supplier.nombre || supplier.name || supplier.razon_social}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sección de selección de insumos */}
                        <div className="row mb-4">
                            <div className="col-md-5">
                                <label htmlFor="ID_input" className="form-label">Seleccionar Insumo</label>
                                <select 
                                    className="form-select form-select-lg"
                                    id="ID_input"
                                    value={newInput.ID_input}
                                    onChange={handleSelectInput}
                                >
                                    <option value="">Seleccione un insumo</option>
                                    {inputs.map(input => (
                                        <option key={input.id} value={input.id}>
                                            {input.InputName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-2">
                                <label htmlFor="InitialQuantity" className="form-label">Cantidad</label>
                                <input 
                                    type="number" 
                                    className="form-control form-control-lg"
                                    id="InitialQuantity"
                                    name="InitialQuantity"
                                    value={newInput.InitialQuantity}
                                    onChange={handleInputChange}
                                    min="0.01"
                                    step="0.01"
                                />
                            </div>
                            <div className="col-md-2">
                                <label htmlFor="UnitMeasurement" className="form-label">Unidad</label>
                                <select 
                                    className="form-select form-select-lg"
                                    id="UnitMeasurement"
                                    name="UnitMeasurement"
                                    value={newInput.UnitMeasurement}
                                    onChange={handleInputChange}
                                >
                                    <option value="g">g</option>
                                    <option value="Kg">Kg</option>
                                    <option value="lb">lb</option>
                                </select>
                            </div>
                            <div className="col-md-2">
                                <label htmlFor="UnityPrice" className="form-label">Precio Unitario</label>
                                <input 
                                    type="number" 
                                    className="form-control form-control-lg"
                                    id="UnityPrice"
                                    name="UnityPrice"
                                    value={newInput.UnityPrice}
                                    onChange={handleInputChange}
                                    min="0.01"
                                    step="0.01"
                                />
                            </div>
                            <div className="col-md-1 d-flex align-items-end">
                                <button 
                                    onClick={agregarInput} 
                                    className="btn btn-primary btn-lg"
                                    disabled={!newInput.ID_input}
                                >
                                    <i className="bi bi-plus"></i>
                                </button>
                            </div>
                        </div>

                        {/* Información del insumo seleccionado */}
                        {selectInput && (
                            <div className="alert alert-info mb-4">
                                <p className="mb-1"><strong>Nombre:</strong> {selectInput.InputName}</p>
                                <p className="mb-1"><strong>Stock actual:</strong> {selectInput.CurrentStock} g</p>
                                <p className="mb-0"><strong>Unidad medida:</strong> {selectInput.UnitMeasurement}</p>
                            </div>
                        )}

                        {/* Detalles de la orden */}
                        <div className="mb-4">
                            <h5>Insumos Agregados</h5>
                            {purchaseOrder.inputs.length === 0 ? (
                                <div className="alert alert-info">No hay insumos agregados</div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Insumo</th>
                                                <th>Cantidad</th>
                                                <th>Unidad</th>
                                                <th>Precio Unitario</th>
                                                <th>Subtotal</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {purchaseOrder.inputs.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.InputName || `Insumo ID: ${item.ID_input}`}</td>
                                                    <td>{item.InitialQuantity}</td>
                                                    <td>{item.UnitMeasurement}</td>
                                                    <td>${item.UnityPrice?.toFixed(2) || '0.00'}</td>
                                                    <td>${(item.InitialQuantity * item.UnityPrice).toFixed(2)}</td>
                                                    <td>
                                                        <button 
                                                            onClick={() => eliminarInput(index)}
                                                            className="btn btn-danger btn-sm"
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan="4" className="text-end fw-bold">Total:</td>
                                                <td className="fw-bold">
                                                    ${purchaseOrder.inputs.reduce((sum, item) => 
                                                        sum + (item.UnityPrice || 0) * item.InitialQuantity, 0
                                                    ).toFixed(2)}
                                                </td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-primary" 
                            onClick={sendPurchaseOrder}
                            disabled={purchaseOrder.inputs.length === 0 || !purchaseOrder.ID_supplier}
                        >
                            Guardar Orden
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreatePurchaseOrderModal;