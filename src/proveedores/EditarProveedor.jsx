import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_PROVEEDOR = 'http://localhost:8000/api/proveedores';

function EditSupplierModal({ supplier, onClose, onSupplierUpdated }) {
    const [supplierUpdate, setSupplierUpdate] = useState(supplier);

    const updateSupplier = async () => {
        try {
            await axios.put(`${API_PROVEEDOR}/${supplier.id}`, supplierUpdate);
            onSupplierUpdated();
            onClose();
        } catch (error) {
            console.error("Error al Actualizar el proveedor: ",error);
        }
    }

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">Editar Proveedor</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label">Proveedor</label>
                            <input 
                                type="text" 
                                className="form-control form-control-lg" 
                                id='name'
                                value={supplierUpdate.name} 
                                onChange={(e) => setSupplierUpdate({ ...supplierUpdate, name: e.target.value })} 
                                required 
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Correo Electrónico</label>
                            <input 
                                type="email" 
                                className="form-control form-control-lg" 
                                id="email" 
                                value={supplierUpdate.email} 
                                onChange={(e) => setSupplierUpdate({ ...supplierUpdate, email: e.target.value })} 
                                required 
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Addres" className="form-label">Direccion</label>
                            <input 
                                type="text" 
                                className="form-control form-control-lg" 
                                id="Addres" 
                                value={supplierUpdate.Addres} 
                                onChange={(e) => setSupplierUpdate({ ...supplierUpdate, Addres: e.target.value })} 
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Phone" className="form-label">Telefono</label>
                            <input 
                                type="number" 
                                className="form-control form-control-lg" 
                                id="Phone" 
                                value={supplierUpdate.Phone} 
                                onChange={(e) => setSupplierUpdate({ ...supplierUpdate, Phone: e.target.value })} 
                            />
                        </div>
                        
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="button" className="btn btn-primary" onClick={updateSupplier}>
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditSupplierModal;