import { Pagination } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import SideBar from '../components/SideBar';
import Titulo from '../components/Titulo.jsx';
import { socket } from '../main.jsx';
import '../styles/historial.css';

function Historial() {

    const [historial, setHistorial] = useState([]);
    const [texto, setTexto] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const obtenerHistorial = (texto, page) => {
        socket.emit('historial', texto, page);
    };

    const cambiarPagina = (e, value) => setPage(value);

    useEffect(() => {
        socket.on('historial', historial => setHistorial(historial));
        socket.on('total-paginas', totalPages => setTotalPages(totalPages));
        socket.on('cambios', () => obtenerHistorial(texto, page));
        obtenerHistorial(texto, page);
        return () => {
            socket.off('clientes');
            socket.off('total-paginas');
            socket.off('cambios');
        };
    }, [texto, page]);

    return (
        <React.Fragment>
            <SideBar />
            <div className="main-content">
                <Titulo />
                <div className="padre">
                    <div className="content content-lista">
                        <p className="subtitulo">HISTORIAL</p>
                        <div className="group-buscar">
                            <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Buscar historial..." type="search" className="input-buscar" />
                        </div>
                        <table className="tabla-clientes">
                            <thead>
                                <tr>
                                    <th className="encabezados">Fecha</th>
                                    <th className="encabezados">Hora</th>
                                    <th className="encabezados">DNI</th>
                                    <th className="encabezados">Nombre</th>
                                    <th className="encabezados">Detalle</th>
                                    <th className="encabezados">Clases</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    historial?.map((hist, index) => (
                                        <tr className={`${hist.tipo === 'modificacion' ? 'verde-claro' : 'rojo-claro'}`} key={index}>
                                            <td className="contenido">{hist.fecha}</td>
                                            <td className="contenido">{hist.hora}</td>
                                            <td className="contenido">
                                                <NumericFormat value={hist.dni} thousandSeparator='.' decimalSeparator="," decimalScale={0} displayType='text' />
                                            </td>
                                            <td className="contenido">{hist.nombre}</td>
                                            <td className="contenido">{hist.tipo === 'modificacion' ? `Modificación` : `Ingreso`}</td>
                                            <td className={`contenido ${hist.clases < 0 ? 'rojo-fuerte' : ''}`}>{hist.clases}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        <div className='pagination pagination-historial'>
                            <Pagination page={page} count={totalPages} onChange={cambiarPagina} />
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Historial