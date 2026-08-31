const mongoose = require("mongoose")

const attendanceSchema = new mongoose.Schema({
    fullName:String,
    rollNo:String,
    class:Number,
    section:String,
    status:String,
    date:Date,
    userId:String
})

const attendanceModel = mongoose.model("attendance",attendanceSchema);
module.exports = attendanceModel;