const mongoose = require("mongoose");

const URI = "mongodb://127.0.0.1:27017/gym";

mongoose.connect(URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));

module.exports = mongoose;
