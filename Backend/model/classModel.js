const mongoose = require("mongoose")

const classSchema = new mongoose.Schema({
    class:Number,
    section:String,
    subject:String,
    studentEnroll:Number,
    userId:String
})

const classModel = mongoose.model("class",classSchema,"classes")
module.exports = classModel;