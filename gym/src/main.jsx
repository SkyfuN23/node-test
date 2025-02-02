import 'bootstrap-icons/font/bootstrap-icons.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { io } from 'socket.io-client';
import Router from './Router.jsx';
import './styles/all.css';

export const URL = `http://46.101.200.58:3000`;
export const socket = io(URL);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
);