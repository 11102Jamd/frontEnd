import React from 'react';
import '../App.css';

function Header() {
    return (
        <nav className="navbar navbar-expand navbar-light bg-custom topbar mb-4 static-top shadow">
            <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                <i className="fa fa-bars"></i>
            </button>


            <div className="container-fluid">
                <div className="mx-auto">
                <h1 className="h4 mb-0 text-white text-center">Pan de Yuca Que Rico</h1>
                </div>

                <div className="ml-auto"> 
                <ul className="navbar-nav">
                    <li className="nav-item dropdown no-arrow">
                    <span className="nav-link">
                        <span className="mr-2 d-none d-lg-inline text-white">Administrador@vcii</span>
                        <i className="bi bi-person-circle text-white"></i>
                    </span>
                    </li>
                </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;