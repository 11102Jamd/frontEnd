import React, { useState } from "react";
import axios from "axios";

const API_INSUMOS = 'http://localhost:8000/api/insumos';

function CrearInsumoModal({ onClose, onInsumoCreado }){
    const [nuevoInsumo, setNuevoInsumo] = useState({
        InputName: '',
    });

    const crearInsumo = async () => {
        try {
            await axios.post(API_INSUMOS, nuevoInsumo);
            onInsumoCreado();
            onClose();
            setNuevoInsumo({
                InputName: '',
            });
        } catch (error) {
            console.error('Error al crear el insumo:', error);
        }
    };

    return (
        <div className="form-modal">
            <h2>Crear Insumo</h2>
            <input type="text" name="InputName" placeholder="Nombre Producto" value={nuevoInsumo.InputNameName} onChange={(e) => setNuevoInsumo({ ...nuevoInsumo, InputName: e.target.value })} required/>
            <br />
            <button onClick={crearInsumo} className="button-save">Guardar</button>
            <button onClick={onClose} className="button-close">Cerrar</button>
        </div>
    );
}

export default CrearInsumoModal;