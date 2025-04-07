import React, { useState } from "react";
import axios from "axios";


const API_PROVEEDOR = 'http://localhost:8000/api/proveedores';

function CrearProveedorModal({ onClose, onProveedorCreado}){
    const [nuevoProveedor, setNuevoProveedor] = useState({
        name:'',
        email:'',
        Addres:'',
        Phone:''
    });

    const crearProveedor = async () => {
        try {
            await axios.post(API_PROVEEDOR, nuevoProveedor);
            onProveedorCreado();
            onClose();
            setNuevoProveedor({
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
        <div className="form-modal">
            <h2>Crear Proveedor</h2>
            <input type="text" placeholder="Empresa o Nombre" value={nuevoProveedor.name} onChange={(e) => setNuevoProveedor({ ...nuevoProveedor, name: e.target.value })} required />
            <br />
            <input type="email" placeholder="Correo Electronico" value={nuevoProveedor.email} onChange={(e) => setNuevoProveedor({ ...nuevoProveedor, email: e.target.value })} required />
            <br />
            <input type="text" placeholder="Direccion" value={nuevoProveedor.Addres} onChange={(e) => setNuevoProveedor({ ...nuevoProveedor, Addres: e.target.value })} required />
            <br />
            <input type="number" placeholder="Telefono" value={nuevoProveedor.Phone} onChange={(e) => setNuevoProveedor({ ...nuevoProveedor, Phone: e.target.value })} required />
            <br />
            <button onClick={crearProveedor} className="button-save">Guardar</button>
            <button onClick={onClose} className="button-close">Cerrar</button>
        </div>
    );
}
export default CrearProveedorModal;