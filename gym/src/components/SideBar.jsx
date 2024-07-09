import React from 'react';

function SideBar() {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>Menu</h2>
            </div>
            <div className="sidebar-menu">
                <a href="login" target="_blank"><i className="bi bi-box-arrow-in-right"></i>Acceso clientes</a>
                <a href="carga"><i className="bi bi-person-plus-fill"></i>Carga clientes</a>
                <a href="lista"><i className="bi bi-person-lines-fill"></i>Lista clientes</a>
                <a href="historial"><i className="bi bi-clock-history"></i>Historial</a>
            </div>
        </div>
    )
}

export default SideBar;