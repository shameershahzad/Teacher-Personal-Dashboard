const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
   name:String,
   email:String,
   password:String
})

const registerModel = mongoose.model("register",registerSchema,"admins")
module.exports = registerModel;