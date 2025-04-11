import React from "react";
import '../App.css';

function MainContent({ children }) {
    return (
        <div className="container-fluid">
            <div className="row">
                {children}
            </div>
        </div>
    );
}

export default MainContent;