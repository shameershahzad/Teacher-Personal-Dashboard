const express = require("express")
const classModel = require("../model/classModel")
const verifyToken = require("../middleware/verifyToken")
const studentModel = require("../model/studentModel")
const router = express.Router()

router.post("/addClasses",verifyToken,(req,res) => {
     req.body.userId = req.userId;
    classModel.create(req.body)
    .then((result) => res.status(200).json({data:result,message:"Class added"}))
    .catch((err) => res.status(404).json(err))
})

router.get("/showClasses",verifyToken,async(req,res) => {
    try{
      //.lean() Use it when you just want to read and send data, not update/save it
      const classes = await classModel.find({userId:req.userId},{}).sort({class:1}).lean() 
      for(const c of classes){
        c.countStd = await studentModel.countDocuments({class:c.class,section:c.section})
      }
      return res.status(200).json({result:classes,message:"Classes found!"})
    }catch(err){
      return res.status(404).json({error:err})
    }
})

router.delete("/deleteClass/:id", verifyToken, (req, res) => {
  classModel.findOneAndDelete({ _id: req.params.id, userId: req.userId })
    .then(deleted => res.json({ message: "Deleted successfully", deleted }))
    .catch(err => res.status(500).json(err));
});

router.get("/prevClass/:id",verifyToken, async(req, res) => {

try{
    const foundClasses = await classModel.findOne({_id:req.params.id,userId:req.userId})   
      if (!foundClasses) {
        return res.status(404).json({ message: "Class not found" });
      }
      return res.status(200).json({result :foundClasses,message:"Classess found!"});

}catch(err){
    return res.status(500).json({ error: err.message });
}
});

// UPDATE Class
router.put("/editClass/:id", verifyToken, (req, res) => {
  classModel.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body // update data you send from frontend
  )
    .then(updated => res.json(updated))
    .catch(err => res.status(500).json(err));
});

router.get("/sendClassesOnStudent",verifyToken,async(req,res) => {
  try{
   const classFound = await classModel.find({userId:req.userId}, { class: 1, section: 1 }).sort({class:1})//send only class 
     
    return res.status(200).json({result:classFound,message:"Classes found!"})
  }catch(err){
     return res.status(500).json({error:err.message}) 
  }
})  

router.get("/sendClassesOnTimeTable",verifyToken,(req,res) => {
 classModel.find({userId:req.userId}, { class: 1, section: 1 }).sort({ class: 1, section: 1 }) // find class:1 means show field 0 means hide field
  .then((result) => res.status(200).json(result))
 .catch((err) => res.status(404).json("Err:",err))
})

router.get("/sendClassesOnAttendance",verifyToken,(req,res) => {
 classModel.find({userId:req.userId}, { class: 1, section: 1 }).sort({ class: 1, section: 1 }) // find class:1 means show field 0 means hide field
  .then((result) => res.status(200).json(result))
 .catch((err) => res.status(404).json("Err:",err))
})

router.get("/sendClassesOnshowAttendance",verifyToken,(req,res) => {
 classModel.find({userId:req.userId}, { class: 1, section: 1,date:1 }).sort({ class: 1, section: 1,date:-1 }) // find class:1 means show field 0 means hide field
  .then((result) => res.status(200).json(result))
 .catch((err) => res.status(404).json("Err:",err))
})


router.get("/showStudents", verifyToken, async (req, res) => {
  const { class: cls, section } = req.query;

  try {
    const data = await studentModel.find({ class: cls, section: section, userId: req.userId }).sort({rollNo:1});
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/sendDataOnAddTimeTable",verifyToken,(req,res) => {
 classModel.find({userId:req.userId}, { class: 1, section: 1,subject:1 }).sort({ class: 1, section: 1,subject:1 }) // find class:1 means show field 0 means hide field
  .then((result) => res.status(200).json(result))
 .catch((err) => res.status(404).json("Err:",err))
})


module.exports = router