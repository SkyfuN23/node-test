const { Server } = require('socket.io');
const socketFunctions = require('./socketFunctions.js');
const mongoose = require("./database/database.js"); // Importa la conexión a MongoDB desde database.js

const PORT = 3000;
const io = new Server(PORT, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log('New client connected');
    socketFunctions(io, socket); // Lógica de manejo de sockets
});

console.log(`Socket.io server running on port ${PORT}`);
