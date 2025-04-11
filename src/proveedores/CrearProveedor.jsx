import React, { useState } from "react";
import axios from "axios";


const API_PROVEEDOR = 'http://localhost:8000/api/proveedores';

function CreateSupplierModal({ onClose, onSupplierCreated}){
    const [newSupplier, setNewSupplier] = useState({
        name:'',
        email:'',
        Addres:'',
        Phone:''
    });

    const createSupplier = async () => {
        try {
            await axios.post(API_PROVEEDOR, newSupplier);
            onSupplierCreated();
            onClose();
            setNewSupplier({
                name:'',
                email:'',
                Addres:'',
                Phone:''
            });
        } catch (error) {
            console.error('Error al crear el proveedor:', error);
        }
    }

    return(
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg">
            <div className="modal-content">
                <div className="modal-header bg-primary text-white">
                    <h5 className="modal-title">Crear Nuevo Proveedor</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                </div>
                <div className="modal-body">
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Proveedor</label>
                        <input 
                            type="text" 
                            className="form-control form-control-lg" 
                            id="name" 
                            value={newSupplier.name} 
                            onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Correo Electrónico</label>
                        <input 
                            type="email" 
                            className="form-control form-control-lg" 
                            id="email" 
                            value={newSupplier.email} 
                            onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })} 
                            required 
                        />
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="Addres" className="form-label">Direccion</label>
                        <input 
                            type="text" 
                            className="form-control form-control-lg" 
                            id="Addres" 
                            value={newSupplier.Addres} 
                            onChange={(e) => setNewSupplier({ ...newSupplier, Addres: e.target.value })} 
                        />
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="Phone" className="form-label">Telefono</label>
                        <input 
                            type="number" 
                            className="form-control form-control-lg" 
                            id="Phone" 
                            value={newSupplier.Phone} 
                            onChange={(e) => setNewSupplier({ ...newSupplier, Phone: e.target.value })} 
                            required 
                        />
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                        Cerrar
                    </button>
                    <button type="button" className="btn btn-primary" onClick={createSupplier}>
                        Guardar Proveedor
                    </button>
                </div>
            </div>
        </div>
    </div>
    );
}
export default CreateSupplierModal;