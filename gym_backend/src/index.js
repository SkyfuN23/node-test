// server.js (Archivo principal para iniciar el servidor Socket.IO y la lógica de negocio)
const { Server } = require('socket.io');
const socketFunctions = require('./socketFunctions.js');
const mongoose = require("./database/database.js");

const io = new Server(3000, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log('New client connected');
    socketFunctions(io, socket);
});

console.log('Socket.io server running on port 3000');
