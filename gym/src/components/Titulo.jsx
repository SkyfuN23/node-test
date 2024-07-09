import React from 'react';
import myImage from '../assets/dumbbell.svg';

function Titulo({ className = '' }) {
    return (
        <h1 className={`titulo ${className}`}><img className={`icono ${className === 'titulo-login' && 'img-login'}`} src={myImage} alt="dumbbell" />XTREME</h1>
    )
}

export default Titulo