const mongoose = require("mongoose");
const { Schema } = mongoose;

const Reset = new Schema(
    {
        clientes: {
            type: Array,
        },
        historial: {
            type: Array,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Reset", Reset);