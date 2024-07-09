const Cliente = require('./database/models/Cliente.js');
const Historial = require('./database/models/Historial.js');
const Reset = require('./database/models/Reset.js');

function capitalizeFirstLetterOfEachWord(text) {
    return text.split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
}

function eliminarCaracteresEspeciales(texto) {
    // Definir los caracteres especiales que deseas eliminar
    const caracteresEspeciales = /[.*+?^${}()|[\]\\]/g;
    // Reemplazar los caracteres especiales con una cadena vacía
    return texto.replace(caracteresEspeciales, '');
}

async function guardarCliente(cliente, socket) {
    cliente.clases = parseInt(cliente.clases);
    cliente.nombre = cliente.nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    cliente.nombre = capitalizeFirstLetterOfEachWord(cliente.nombre);
    const clienteCreado = await Cliente.create(cliente);
    await Historial.create({
        nombre: clienteCreado.nombre,
        dni: clienteCreado.dni,
        fecha: new Date().toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' }),
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        clases: clienteCreado.clases,
        id_cliente: clienteCreado._id,
        tipo: 'modificacion'
    });
};

async function checkDNI(dni, socket) {
    const cliente = await Cliente.findOne({ dni });
    if (cliente) {
        socket.emit('dni-existe', dni);
    }
}

async function obtenerClientes(texto, page, socket) {
    let limit = 15;
    const saltarEstudios = limit * (page - 1);
    let filtro = {};
    texto = eliminarCaracteresEspeciales(texto);
    if (texto !== "") {
        filtro.$or = [
            { "dni": { $regex: texto, $options: "i" } },
            { "nombre": { $regex: texto, $options: "i" } },
            { "telefono": { $regex: texto, $options: "i" } },
            { "telefonoEmergencia": { $regex: texto, $options: "i" } },
        ];
    };
    const clientes = await Cliente.find(filtro).sort({ createdAt: -1 }).skip(saltarEstudios).limit(limit);
    const paginasTotal = Math.ceil((await Cliente.countDocuments(filtro)) / limit);
    socket.emit('clientes', clientes);
    socket.emit("total-paginas", paginasTotal);
}

async function cambiarClases(id, clases, io) {
    const cliente = await Cliente.findByIdAndUpdate(id, { clases }, { new: true });
    await Historial.create({
        nombre: cliente.nombre,
        dni: cliente.dni,
        fecha: new Date().toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' }),
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        clases: cliente.clases,
        id_cliente: cliente._id,
        tipo: 'modificacion'
    });
    io.emit('cambios');
}

async function guardarClienteEditado(cliente, io) {
    const clienteAntes = await Cliente.findById(cliente._id);
    await Cliente.findByIdAndUpdate(cliente._id, cliente);
    await Historial.updateMany({ id_cliente: cliente._id }, { dni: cliente.dni, nombre: cliente.nombre });
    if (clienteAntes.clases !== parseFloat(cliente.clases)) {
        await Historial.create({
            nombre: cliente.nombre,
            dni: cliente.dni,
            fecha: new Date().toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' }),
            hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            clases: cliente.clases,
            id_cliente: cliente._id,
            tipo: 'modificacion'
        });
    };
    io.emit('cambios');
};

async function login(dni, socket, io) {
    const cliente = await Cliente.findOneAndUpdate(
        { dni },
        { $inc: { clases: -1 } },
        { new: true }
    );
    if (cliente) {
        socket.emit('login-ok', cliente);
        await Historial.create({
            nombre: cliente.nombre,
            dni: cliente.dni,
            fecha: new Date().toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' }),
            hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            clases: cliente.clases,
            id_cliente: cliente._id,
            tipo: 'ingreso'
        });
        io.emit('cambios');
    } else {
        socket.emit('login-error');
    }
}

async function obtenerHistorial(texto, page, socket) {
    let limit = 15;
    const saltar = limit * (page - 1);
    let filtro = {};
    texto = eliminarCaracteresEspeciales(texto);
    if (texto !== "") {
        filtro.$or = [
            { "dni": { $regex: texto, $options: "i" } },
            { "nombre": { $regex: texto, $options: "i" } },
            { "fecha": { $regex: texto, $options: "i" } },
            { "hora": { $regex: texto, $options: "i" } },
            { "tipo": { $regex: texto, $options: "i" } },
        ];
    };
    const historial = await Historial.find(filtro).sort({ createdAt: -1 }).skip(saltar).limit(limit);
    const paginasTotal = Math.ceil((await Historial.countDocuments(filtro)) / limit);
    socket.emit('historial', historial);
    socket.emit("total-paginas", paginasTotal);
}

async function resetMes(io) {
    const clientes = await Cliente.find();
    const historial = await Historial.find();
    await Reset.create({
        clientes,
        historial
    });
    await Cliente.updateMany({ clases: { $gte: 0 } }, { $set: { clases: 0 } });
    io.emit('cambios');
}

function socketFunctions(io, socket) {
    socket.on('guardar-cliente', async cliente => await guardarCliente(cliente, socket));
    socket.on('check-dni', async dni => await checkDNI(dni, socket));
    socket.on('clientes', async (texto, page) => await obtenerClientes(texto, page, socket));
    socket.on('cambiar-clases', async (id, clases) => await cambiarClases(id, clases, io));
    socket.on('guardar-cliente-editado', async (cliente) => await guardarClienteEditado(cliente, io));
    socket.on('login', async dni => await login(dni, socket, io));
    socket.on('historial', async (texto, page) => await obtenerHistorial(texto, page, socket));
    socket.on('cierre-mes', async () => await resetMes(io));
}

function generarNombreAleatorio() {
    var nombres = ["Juan", "maría", "CarlOs", "Ana", "Luis", "Laura", "pedRo", "Marta", "Diego", "sofíA"];
    var apellidos = ["García", "MartínEz", "lópez", "Rodríguez", "Fernández", "Pérez", "gonzálEz", "Hernández", "Díaz", "moreno"];

    var nombreAleatorio = nombres[Math.floor(Math.random() * nombres.length)];
    var apellidoAleatorio = apellidos[Math.floor(Math.random() * apellidos.length)];

    return nombreAleatorio + " " + apellidoAleatorio;
}

function generarNumeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function generarClientes() {
    for (let i = 0; i < 100; i++) {
        const cliente = {
            dni: generarNumeroAleatorio(10000000, 50000000),
            nombre: generarNombreAleatorio(),
            telefono: generarNumeroAleatorio(2914000000, 2916000000),
            telefonoEmergencia: generarNumeroAleatorio(2914000000, 2916000000),
            clases: generarNumeroAleatorio(0, 10),
        }
        await guardarCliente(cliente);
    }
};

//generarClientes();

module.exports = socketFunctions;