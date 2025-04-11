import React from "react";
import '../App.css';

function Footer() {
    return (
        <footer className="sticky-footer bg-custom shadow">
            <div className="container my-auto">
                <div className="copyright text-center my-auto">
                    <span>Página creada por el equipo de desarrollo: &copy; S-G-R {new Date().getFullYear()}</span>
                </div>
            </div>
        </footer>
    );
}

export default Footer;