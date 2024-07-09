require('./database/database.js');
const { Server } = require('socket.io');
const socketFunctions = require('./socketFunctions.js');

const io = new Server(3000, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => socketFunctions(io, socket));

console.log('Socket.io server running on port 3000');