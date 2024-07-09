// const mongoose = require('mongoose');
// const Cliente = require('./models/Cliente'); // Importa el modelo Cliente definido en Cliente.js
// const URI = 'mongodb://127.0.0.1:27017/gym'; // URI de tu base de datos MongoDB

// mongoose.connect(URI)
//   .then(() => {
//     console.log('MongoDB connected successfully');

//     // Datos del cliente a agregar
//     const nuevoCliente = new Cliente({
//       dni: '12345678A',
//       nombre: 'Juan Pérez',
//       telefono: '123456789',
//       telefonoEmergencia: '987654321',
//       clases: 5
//     });

//     // Guardar el cliente en la base de datos
//     nuevoCliente.save()
//       .then(() => {
//         console.log('Cliente agregado correctamente');
//         mongoose.connection.close(); // Cierra la conexión después de guardar
//       })
//       .catch(err => {
//         console.error('Error al agregar cliente:', err);
//         mongoose.connection.close(); // Cierra la conexión en caso de error también
//       });
//   })
//   .catch((err) => console.error('Error connecting to MongoDB:', err));

const mongoose = require("mongoose");

const URI = "mongodb+srv://masjulianf:6AxIzQubRfEAr5qX@gym.5axf8sj.mongodb.net/?retryWrites=true&w=majority&appName=Gym";
            

mongoose
    .connect(URI)
    .then((db) => console.log("DB is connected"))
    .catch((err) => console.error(err));

module.exports = mongoose;