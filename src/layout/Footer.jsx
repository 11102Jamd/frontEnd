import React from "react";

function Footer() {
    return (
        <footer className="footer" style={{
            borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
            <div className="container">
                <span>Página creada por el equipo de desarrollo: &copy; S-G-R {new Date().getFullYear()}</span>
            </div>
        </footer>
    );
}

export default Footer;