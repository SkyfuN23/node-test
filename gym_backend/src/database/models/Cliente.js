const mongoose = require("mongoose");
const { Schema } = mongoose;

const Cliente = new Schema(
    {
        dni: {
            type: String,
        },
        nombre: {
            type: String,
        },
        telefono: {
            type: String,
        },
        telefonoEmergencia: {
            type: String,
        },
        clases: {
            type: Number,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Cliente", Cliente);
