import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from "./layout/Sidebar";
import MainContent from "./layout/MainContent";
import Footer from "./layout/Footer";
import Header from "./layout/Header";

import Usuarios from './usuarios/UsuariosList';
import Productos from "./productos/ProductosList";
import Pedidos from "./pedidos/PedidosList";
import Proveedor from "./proveedores/ProveedoresList";
import Insumos from "./insumos/InsumosList";
import Compras from "./compras/ComprasList";

import './App.css';


function App() {
    return (
        <Router>
            <div className="app-container">
                <Sidebar />
                <MainContent>
                        <Routes>
                            <Route path="/" element={<h1>Bienvenido</h1>} />
                            <Route path="/usuarios" element={<Usuarios />} />
                            <Route path="/productos" element={<Productos />} />
                            <Route path="/pedidos" element={<Pedidos />} />
                            <Route path="/proveedores" element={<Proveedor />} />
                            <Route path="/insumos" element={<Insumos />} />
                            <Route path="/compras" element={<Compras />} />
                        </Routes>
                </MainContent>
            </div>
            <Footer />
        </Router>
    );
}

export default App;