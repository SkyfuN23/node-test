import React, { useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import SideBar from '../components/SideBar.jsx';
import Titulo from '../components/Titulo.jsx';
import '../styles/carga.css';

import { socket } from '../main.jsx';

function Carga() {

    const [cliente, setCliente] = useState({
        nombre: '',
        dni: '',
        telefono: '',
        telefonoEmergencia: '',
        clases: '',
    });

    const limpiar = () => {
        setCliente({
            nombre: '',
            dni: '',
            telefono: '',
            telefonoEmergencia: '',
            clases: '',
        })
    };

    const checkDNI = () => {
        socket.emit('check-dni', cliente.dni);
    };

    const checkValue = (label) => {
        let boolean = false;
        if (cliente[label] !== '') {
            boolean = true;
        }
        return boolean;
    }

    const changeHandler = (value, label) => {
        setCliente(prev => ({ ...prev, [label]: value }));
    };

    const guardar = () => {
        if (
            cliente.dni === '' ||
            cliente.nombre === '' ||
            cliente.telefono === '' ||
            cliente.telefonoEmergencia === '' ||
            cliente.clases === ''
        ) {
            alert('FALTAN DATOS');
            return;
        }
        socket.emit('guardar-cliente', cliente);
        limpiar();
    };

    useEffect(() => {
        socket.on('dni-existe', (dni) => {
            alert(`ESTE DNI: ${dni} YA EXISTE, PARA CARGAR CLASES O EDITAR VAYA A LA LISTA DE CLIENTES`);
            limpiar();
        });
        return () => {
            socket.off('dni-existe');
        };
    }, []);

    return (
        <React.Fragment>
            <SideBar />
            <div className="main-content">
                <Titulo />
                <div className="padre">
                    <div className="content content-carga">
                        <p className="subtitulo">CARGA DE CLIENTE</p>
                        <div className="form">
                            <div className="group">
                                <NumericFormat onBlur={checkDNI} onValueChange={e => changeHandler(e.value, 'dni')} value={cliente.dni} thousandSeparator='.' decimalSeparator="," decimalScale={0} className='input' />
                                <span className="highlight"></span>
                                <span className="bar"></span>
                                <label className={checkValue('dni') ? 'label-active' : ''}>DNI</label>
                            </div>
                            <div className="group">
                                <input required onChange={e => changeHandler(e.target.value, 'nombre')} value={cliente.nombre} type="text" className="input" />
                                <span className="highlight"></span>
                                <span className="bar"></span>
                                <label className={checkValue('nombre') ? 'label-active' : ''}>Nombre y apellido</label>
                            </div>
                            <div className="group">
                                <input value={cliente.telefono} onChange={e => changeHandler(e.target.value, 'telefono')} type="text" className='input' />
                                <span className="highlight"></span>
                                <span className="bar"></span>
                                <label className={checkValue('telefono') ? 'label-active' : ''}>Telefono</label>
                            </div>
                            <div className="group">
                                <input value={cliente.telefonoEmergencia} onChange={e => changeHandler(e.target.value, 'telefonoEmergencia')} type="text" className='input' />
                                <span className="highlight"></span>
                                <span className="bar"></span>
                                <label className={checkValue('telefonoEmergencia') ? 'label-active' : ''}>Telefono emergencia</label>
                            </div>
                            <div className="group">
                                <NumericFormat onValueChange={e => changeHandler(e.value, 'clases')} value={cliente.clases} thousandSeparator='.' decimalSeparator="," decimalScale={0} className='input' />
                                <span className="highlight"></span>
                                <span className="bar"></span>
                                <label className={checkValue('clases') ? 'label-active' : ''}>Clases</label>
                            </div>
                            <div className="button-group">
                                <button className="button-34" onClick={limpiar}>Limpiar</button>
                                <button className="button-34" onClick={guardar}>Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
};

export default Carga