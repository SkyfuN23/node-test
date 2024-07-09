import React, { useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import Modal from '../components/Modal.jsx';
import Titulo from '../components/Titulo.jsx';
import { socket } from '../main.jsx';
import '../styles/login.css';
import myLogo from '../assets/logo.png';

const TIEMPO_ESPERA = 5000;

function Login() {

    const [dni, setDNI] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [cliente, setCliente] = useState({
        nombre: '',
        dni: '',
        telefono: '',
        telefonoEmergencia: '',
        clases: '',
    });
    const [modalDataOK, setModalDataOK] = useState(true);

    const login = (key) => {
        if (key === 'Enter' && !modalOpen) {
            socket.emit('login', dni);
        };
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const loginOK = (cliente) => {
        setModalOpen(true);
        setModalDataOK(true);
        setCliente(cliente);
        setTimeout(() => {
            window.location.reload();
        }, TIEMPO_ESPERA);
    };

    const loginError = () => {
        setModalOpen(true);
        setModalDataOK(false);
        setTimeout(() => {
            window.location.reload();
        }, TIEMPO_ESPERA);
    };

    useEffect(() => {
        socket.on('login-ok', cliente => loginOK(cliente));
        socket.on('login-error', () => loginError());
        const intervalId = setInterval(() => {
            document.querySelector('.input-login').focus();
        }, 100);
        document.title = 'XTREME - ACCESO'
        return () => {
            socket.off('login-ok');
            socket.off('login-error');
            clearInterval(intervalId);
        };
    }, []);

    return (
        <div className='div-login' onKeyDown={e => login(e.key)}>
            {/* <Titulo className="titulo-login" /> */}
            <img className='imgLogo' src={myLogo} alt="logo" />
            <Modal className={`modal-login ${modalDataOK ? 'verde' : 'rojo'} ${cliente.clases < 0 && 'amarillo'}`} isOpen={modalOpen} onClose={closeModal}>
                {
                    modalDataOK ? (
                        <React.Fragment>
                            <div>¡Bienvenido {cliente.nombre}!</div>
                            <div>Te quedan {cliente.clases} clases restantes.</div>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <div>
                                <NumericFormat value={dni} thousandSeparator='.' decimalSeparator="," decimalScale={0} displayType='text' />
                            </div>
                            <div>DNI NO EXISTE</div>
                        </React.Fragment>
                    )
                }
            </Modal>
            <NumericFormat onValueChange={e => setDNI(e.value)} value={dni} className='input-login' thousandSeparator='.' decimalSeparator="," decimalScale={0} />
        </div>
    )
}

export default Login