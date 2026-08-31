const mongoose = require("mongoose")

const studentSchema = new mongoose.Schema({
  fullName:String,
  rollNo:String,
  gender:String,
  parentcontact:Number, 
  class:Number,
  section:String,
  admissionDate:Date,
  attendance:Number,
  userId:String
})

const studentModel = mongoose.model("students",studentSchema)

module.exports = studentModel;