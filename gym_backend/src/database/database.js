// database.js (Archivo para la conexión a MongoDB)
const mongoose = require("mongoose");

const URI = "mongodb://localhost:27017/gym";

mongoose
    .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("DB is connected"))
    .catch((err) => console.error(err));

module.exports = mongoose;
