import React from "react";
import { Link } from 'react-router-dom';

function Sidebar() {
    return (
        <div className="sidebar">
            <h4 className="mb-4 text-center d-flex flex-column align-items-center h4" style={{
                color: '#fff',
                padding: '10px',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <i className="bi bi-person-circle icono-grande"></i>
            </h4>


            <ul className="nav flex-column">
            <li className="nav-item">
                <Link to="/welcome" className="nav-link text-white sidebar-link">
                    <i className="bi bi-house-door me-2"></i> Inicio
                </Link>
            </li>
            <li className="nav-item">
                <Link to="/usuarios" className="nav-link text-white sidebar-link">
                    <i className="bi bi-people-fill me-2"></i> Usuarios
                </Link>
            </li>
            <li className="nav-item">
                <Link to="/productos" className="nav-link text-white sidebar-link">
                    <i className="bi bi-box-seam me-2"></i> Productos
                </Link>
            </li>
            <li className="nav-item">
                <Link to="/pedidos" className="nav-link text-white sidebar-link">
                    <i className="bi bi-receipt-cutoff me-2"></i> Pedidos
                </Link>
            </li>
            <li className="nav-item">
                <Link to="/proveedores" className="nav-link text-white sidebar-link">
                    <i className="bi bi-truck me-2"></i> Proveedores
                </Link>
            </li>
            <li className="nav-item">
                <Link to="/insumos" className="nav-link text-white sidebar-link">
                    <i className="bi bi-clipboard-data me-2"></i> Insumos
                </Link>
            </li>
            <li className="nav-item">
                <Link to="/compras" className="nav-link text-white sidebar-link">
                    <i className="bi bi-cart-check me-2"></i> Compras
                </Link>
            </li>

            <li className="nav-item">
                <Link to="/fabricacion" className="nav-link text-white sidebar-link">
                    <i className="bi bi-gear-fill me-2"></i> Fabricacion
                </Link>
            </li>

            </ul>
        </div>
    );
}

export default Sidebar;