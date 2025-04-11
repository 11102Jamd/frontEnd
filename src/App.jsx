import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StyleSheetManager } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';
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
import Fabricacion from "./fabricacion/FabricacionList";
import Welcome from "./welcome/welcome";

import './App.css';

function App() {
    return (
        <StyleSheetManager>
            <Router>
                <div id="wrapper">
                <Sidebar />
                <div id="content-wrapper" className="d-flex flex-column">
                        <div id="content">
                            <Header />
                                <Routes>
                                    <Route path="/" element={<h1>Bienvenido</h1>} />
                                    <Route path="/usuarios" element={<Usuarios />} />
                                    <Route path="/productos" element={<Productos />} />
                                    <Route path="/pedidos" element={<Pedidos />} />
                                    <Route path="/proveedores" element={<Proveedor />} />
                                    <Route path="/insumos" element={<Insumos />} />
                                    <Route path="/compras" element={<Compras />} />
                                    <Route path="/fabricacion" element={<Fabricacion/>} />
                                    <Route path="/welcome" element={<Welcome/>} />
                                </Routes>
                            <MainContent />
                        </div>
                    <Footer />
                </div>
                </div>
            </Router>
        </StyleSheetManager>
    );
  }

export default App;
