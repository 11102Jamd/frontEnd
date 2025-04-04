import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import List from './usuarios/UsuariosList';
import ProductosList from './productos/ProductosList'
import Usuarios from './usuarios/UsuariosList';
import Pedidos from './pedidos/PedidosList';
import Proveedor from './proveedores/ProveedoresList';
import Compras from './compras/ComprasList';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Inicio</Link> | 
        <Link to="/usuarios">Usuarios</Link> |
        <Link to="/productos">Productos</Link> |
        <Link to="/pedidos">Pedidos</Link> |
        <Link to="/proveedores">Proveedores</Link> |
        <Link to="/compras">Compras</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<h1>Bienvenido</h1>} />
        <Route path="/usuarios" element={<Usuarios/>} />
        <Route path="/productos" element={<ProductosList/>}></Route>
        <Route path="/pedidos" element={<Pedidos/>}></Route>
        <Route path="/proveedores" element={<Proveedor/>}></Route>
        <Route path="/compras" element={<Compras/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
