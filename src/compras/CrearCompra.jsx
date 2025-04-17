import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

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
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudieron cargar los datos iniciales',
                    icon: 'error'
                });
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
        
        if (input && input.UnityPrice) {
            setNewInput(prev => ({
                ...prev,
                UnityPrice: input.UnityPrice
            }));
        }
    };

    const agregarInput = () => {
        if (!newInput.ID_input || !newInput.InitialQuantity || !newInput.UnitMeasurement || !newInput.UnityPrice) {
            Swal.fire({
                title: 'Campos incompletos',
                text: 'Todos los campos del insumo son obligatorios.',
                icon: 'warning'
            });
            return;
        }

        const inputToAdd = {
            ...newInput,
            InputName: selectInput?.InputName || '',
            InitialQuantity: parseFloat(newInput.InitialQuantity),
            UnityPrice: parseFloat(newInput.UnityPrice)
        };

        setPurchaseOrder({ 
            ...purchaseOrder, 
            inputs: [...purchaseOrder.inputs, inputToAdd] 
        });

        setNewInput({
            ID_input: '',
            InitialQuantity: '',
            UnitMeasurement: newInput.UnitMeasurement,
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
            Swal.fire({
                title: 'Datos incompletos',
                text: 'Faltan datos obligatorios o insumos.',
                icon: 'warning'
            });
            return;
        }

        try {
            const response = await axios.post(API_ORDENES, purchaseOrder);
            await Swal.fire({
                title: '¡Éxito!',
                text: 'Orden creada exitosamente',
                icon: 'success'
            });
            onPurchaseOrderCreated?.(response.data);
            onClose();
        } catch (error) {
            console.error("Error al crear orden:", error.response?.data || error.message);
            Swal.fire({
                title: 'Error',
                text: error.response?.data?.message || error.message || 'Error al crear la orden',
                icon: 'error'
            });
        }
    };

    if (loading) {
        return (
            <div className="modal fade show d-flex align-items-center" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            <p className="mt-2">Cargando datos...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
                            <label htmlFor="ID_supplier" className="form-label">Proveedor *</label>
                            <select 
                                className="form-select"
                                id="ID_supplier"
                                name="ID_supplier"
                                value={purchaseOrder.ID_supplier}
                                onChange={handleOrdenChange}
                                required
                            >
                                <option value="">Seleccione un proveedor</option>
                                {suppliers.map(supplier => (
                                    <option key={supplier.id} value={supplier.id}>
                                        {supplier.name || supplier.nombre || supplier.razon_social}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sección de selección de insumos */}
                        <div className="card mb-4">
                            <div className="card-header bg-light">
                                <h6 className="mb-0">Agregar Insumos</h6>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-5">
                                        <label htmlFor="ID_input" className="form-label">Insumo </label>
                                        <select 
                                            className="form-select"
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
                                        <label htmlFor="InitialQuantity" className="form-label">Cantidad </label>
                                        <input 
                                            type="number" 
                                            className="form-control"
                                            id="InitialQuantity"
                                            name="InitialQuantity"
                                            value={newInput.InitialQuantity}
                                            onChange={handleInputChange}
                                            min="0.01"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label htmlFor="UnitMeasurement" className="form-label">Unidad </label>
                                        <select 
                                            className="form-select"
                                            id="UnitMeasurement"
                                            name="UnitMeasurement"
                                            value={newInput.UnitMeasurement}
                                            onChange={handleInputChange}
                                        >
                                            <option value="g">Gramos (g)</option>
                                            <option value="Kg">Kilogramos (Kg)</option>
                                            <option value="lb">Libras (lb)</option>
                                        </select>
                                    </div>
                                    <div className="col-md-2">
                                        <label htmlFor="UnityPrice" className="form-label">Precio Unitario </label>
                                        <input 
                                            type="number" 
                                            className="form-control"
                                            id="UnityPrice"
                                            name="UnityPrice"
                                            value={newInput.UnityPrice}
                                            onChange={handleInputChange}
                                            min="0.01"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-1 d-flex align-items-end">
                                        <button 
                                            onClick={agregarInput} 
                                            className="btn btn-primary w-100"
                                            disabled={!newInput.ID_input}
                                            title="Agregar insumo"
                                        >
                                            <i className="bi bi-plus-lg"></i>
                                        </button>
                                    </div>
                                </div>

                                {/* Información del insumo seleccionado */}
                                {selectInput && (
                                    <div className="alert alert-info mt-3 mb-0">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <strong>Insumo:</strong> {selectInput.InputName}
                                            </div>
                                            <div className="col-md-4">
                                                <strong>Stock actual:</strong> {selectInput.CurrentStock} g
                                            </div>
                                            <div className="col-md-4">
                                                <strong>Precio actual:</strong> ${selectInput.UnityPrice?.toFixed(2) || '0.00'}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Detalles de la orden */}
                        <div className="card">
                            <div className="card-header bg-light">
                                <h6 className="mb-0">Detalle de la Orden</h6>
                            </div>
                            <div className="card-body p-0">
                                {purchaseOrder.inputs.length === 0 ? (
                                    <div className="alert alert-warning m-3">No hay insumos agregados a la orden</div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Insumo</th>
                                                    <th>Cantidad</th>
                                                    <th>Unidad</th>
                                                    <th>Precio Unitario</th>
                                                    <th>Subtotal</th>
                                                    <th style={{ width: '50px' }}></th>
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
                                                                title="Eliminar"
                                                            >
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot className="table-light">
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