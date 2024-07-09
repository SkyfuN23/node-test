const mongoose = require("mongoose");
const { Schema } = mongoose;

const Historial = new Schema(
    {
        nombre: {
            type: String,
        },
        dni: {
            type: String,
        },
        fecha: {
            type: String,
        },
        hora: {
            type: String,
        },
        clases: {
            type: Number,
        },
        tipo: {
            type: String,
        },
        id_cliente: {
            type: mongoose.Schema.Types.ObjectId,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Historial", Historial);