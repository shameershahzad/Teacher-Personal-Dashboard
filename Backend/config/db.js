const mongoose = require("mongoose");
require('dotenv').config({quiet:true});

const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("DB Connected"))
    .catch((err) => console.log("Error:", err))
}

module.exports = connectDB