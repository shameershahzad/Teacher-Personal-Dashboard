const mongoose = require("mongoose")

const timetableSchema = new mongoose.Schema({
    class:Number,
    time:String,
    section:String,
    subject:String,
    day:String,
    userId:String
})

const timeModel = mongoose.model("timetable",timetableSchema)
module.exports = timeModel;