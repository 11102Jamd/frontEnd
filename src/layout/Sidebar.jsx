import React from "react";
import { Link } from 'react-router-dom';

function Sidebar() {
    return (
        <div className="sidebar">
            <h4 className="mb-4 text-center" style={{
                color: '#fff',
                padding: '10px',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                Dashboard
            </h4>
            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link to="/" className="nav-link text-white sidebar-link">
                        <i className="bi bi-people me-2"></i>
                        Inicio
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/usuarios" className="nav-link text-white sidebar-link">Usuarios</Link>
                </li>
                <li className="nav-item">
                    <Link to="/productos" className="nav-link text-white sidebar-link">Productos</Link>
                </li>
                <li className="nav-item">
                    <Link to="/pedidos" className="nav-link text-white sidebar-link">Pedidos</Link>
                </li>
                <li className="nav-item">
                    <Link to="/proveedores" className="nav-link text-white sidebar-link">Proveedores</Link>
                </li>
                <li className="nav-item">
                    <Link to="/insumos" className="nav-link text-white sidebar-link">Insumos</Link>
                </li>
                <li className="nav-item">
                    <Link to="/compras" className="nav-link text-white sidebar-link">Compras</Link>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;