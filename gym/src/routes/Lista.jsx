import { Pagination } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import Modal from '../components/Modal.jsx';
import SideBar from '../components/SideBar.jsx';
import Titulo from '../components/Titulo.jsx';
import '../styles/lista.css';

import { socket } from '../main.jsx';

function Lista() {

    const [texto, setTexto] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [clientes, setClientes] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [clienteClickeado, setClienteClickeado] = useState({
        nombre: '',
        dni: '',
        telefono: '',
        telefonoEmergencia: '',
        clases: '',
    });

    const limpiar = () => {
        setClienteClickeado({
            nombre: '',
            dni: '',
            telefono: '',
            telefonoEmergencia: '',
            clases: '',
        })
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const obtenerClientes = (texto, page) => {
        socket.emit('clientes', texto, page);
    };

    const cambiarPagina = (e, value) => setPage(value);

    const cambiarClases = (id, cantidad) => {
        socket.emit('cambiar-clases', id, cantidad);
    }

    const clienteClick = (cliente) => {
        setClienteClickeado(cliente);
        setModalOpen(true);
    };

    const checkValue = (label) => {
        let boolean = false;
        if (clienteClick[label] !== '') {
            boolean = true;
        }
        return boolean;
    }

    const changeHandler = (value, label) => {
        setClienteClickeado(prev => ({ ...prev, [label]: value }));
    };

    const guardarEditado = () => {
        if (
            clienteClickeado.dni === '' ||
            clienteClickeado.nombre === '' ||
            clienteClickeado.telefono === '' ||
            clienteClickeado.telefonoEmergencia === '' ||
            clienteClickeado.clases === ''
        ) {
            alert('FALTAN DATOS');
            return;
        }
        socket.emit('guardar-cliente-editado', clienteClickeado);
        limpiar();
        closeModal();
    };

    const checkDNI = () => {
        socket.emit('check-dni', clienteClickeado.dni);
    };

    const cierreMes = () => {
        if (window.confirm('¿Estas seguro que quieres borrar todas las clases?\n\n¡ESTA ACCIÓN ES IRREVERSIBLE!')) {
            socket.emit('cierre-mes');
        }
    };

    useEffect(() => {
        if (page > totalPages) {
            setPage(1);
        }
    }, [totalPages]);

    useEffect(() => {
        socket.on('clientes', clientes => setClientes(clientes));
        socket.on('total-paginas', totalPages => setTotalPages(totalPages));
        socket.on('cambios', () => obtenerClientes(texto, page));
        socket.on('dni-existe', (dni) => {
            alert(`ESTE DNI: ${dni} YA EXISTE, PARA CARGAR CLASES O EDITAR VAYA A LA LISTA DE CLIENTES`);
            setClienteClickeado(prev => ({ ...prev, dni: '' }));
        });
        obtenerClientes(texto, page);
        return () => {
            socket.off('clientes');
            socket.off('total-paginas');
            socket.off('cambios');
            socket.off('dni-existe');
        };
    }, [texto, page]);

    return (
        <React.Fragment>
            <SideBar />
            <div className="main-content">
                <Titulo />
                <Modal isOpen={modalOpen} onClose={closeModal}>
                    <div className="form form-modal">
                        <div className="group">
                            <NumericFormat onBlur={checkDNI} onValueChange={(e) => changeHandler(e.value, 'dni')} value={clienteClickeado.dni} thousandSeparator='.' decimalSeparator="," decimalScale={0} className='input' />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label className={checkValue('dni') ? 'label-active' : ''}>DNI</label>
                        </div>
                        <div className="group">
                            <input onChange={(e) => changeHandler(e.target.value, 'nombre')} required value={clienteClickeado.nombre} type="text" className="input" />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label className={checkValue('nombre') ? 'label-active' : ''}>Nombre y apellido</label>
                        </div>
                        <div className="group">
                            <input value={clienteClickeado.telefono} onChange={e => changeHandler(e.target.value, 'telefono')} type="text" className='input' />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label className={checkValue('telefono') ? 'label-active' : ''}>Telefono</label>
                        </div>
                        <div className="group">
                            <input value={clienteClickeado.telefonoEmergencia} onChange={e => changeHandler(e.target.value, 'telefonoEmergencia')} type="text" className='input' />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label className={checkValue('telefonoEmergencia') ? 'label-active' : ''}>Telefono emergencia</label>
                        </div>
                        <div className="group">
                            <NumericFormat onValueChange={(e) => changeHandler(e.value, 'clases')} value={clienteClickeado.clases} thousandSeparator='.' decimalSeparator="," decimalScale={0} className='input' />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label className={checkValue('clases') ? 'label-active' : ''}>Clases</label>
                        </div>
                        <div className="button-group button-group-modal">
                            <button className="button-34" onClick={guardarEditado}>Guardar</button>
                        </div>
                    </div>
                </Modal>
                <div className="padre">
                    <div className="content content-lista">
                        <p className="subtitulo">LISTA DE CLIENTES</p>
                        <div className="group-buscar">
                            <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Buscar clientes..." type="search" className="input-buscar" />
                            <div className='checkbox-container'>
                                <input type="checkbox" className='input-checkbox'/>
                                <span className='titulo-checkbox'>Mostrar solo negativos</span>
                            </div>
                        </div>
                        <table className="tabla-clientes">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th className="encabezados">DNI</th>
                                    <th className="encabezados">Nombre</th>
                                    <th className="encabezados">Teléfono</th>
                                    <th className="encabezados">Emergencia</th>
                                    <th className="encabezados">Clases</th>
                                    {
                                        /*
                                        <th colSpan={2}></th>
                                        */
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    clientes?.map((cliente, index) => (
                                        <tr key={index}>
                                            <td onClick={() => clienteClick(cliente)} className="contenido icon-td"><i className="bi bi-pencil-square"></i></td>
                                            <td className="contenido">
                                                <NumericFormat value={cliente.dni} thousandSeparator='.' decimalSeparator="," decimalScale={0} displayType='text' />
                                            </td>
                                            <td className="contenido">{cliente.nombre}</td>
                                            <td className="contenido">{cliente.telefono}</td>
                                            <td className="contenido">{cliente.telefonoEmergencia}</td>
                                            <td className="contenido">{cliente.clases}</td>
                                            {/*
                                            <td onClick={() => cambiarClases(cliente._id, parseInt(cliente.clases) + 1)} className="contenido icon-td sumar">
                                                <i className="bi bi-plus-circle"></i>
                                            </td>
                                            <td onClick={() => cambiarClases(cliente._id, parseInt(cliente.clases) - 1)} className="contenido icon-td restar">
                                                <i className="bi bi-dash-circle"></i>
                                            </td>
                                            */}
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        <div className='pagination'>
                            <div onClick={cierreMes} className='botones-lista'>NUEVO MES</div>
                            <Pagination page={page} count={totalPages} onChange={cambiarPagina} />
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Lista;