const express = require("express")
const verifyToken = require("../middleware/verifyToken")
const studentModel = require("../model/studentModel")
const router = express.Router();

router.post("/addStudent",verifyToken,(req,res) => {
req.body.userId = req.userId 
    studentModel.create(req.body)
    .then((result) => res.status(200).json({data:result,mesaage:"Student added!"}))
    .catch((err) => res.status(404).json({error:err.mesaage }))
})

router.delete("/deleteStudent/:id",verifyToken,(req,res) => {
    studentModel.findOneAndDelete({ _id: req.params.id, userId: req.userId })
    .then(deleted => res.json({ message: "Deleted successfully", deleted }))
    .catch(err => res.status(500).json(err));
})

router.get("/showStudents",verifyToken,(req,res) => {
     const selected = req.query.class
        studentModel.find({class:selected, userId:req.userId}).sort({rollNo:1})
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(404).json(err))
})

router.get("/prevStudent/:id", verifyToken,(req, res) => {
  const { id } = req.params;

  studentModel.findOne({ _id: id, userId: req.userId })
    .then(result => {
      if (!result) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.json(result);
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.put("/editStudent/:id", verifyToken, (req, res) => {
  studentModel.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body // update data you send from frontend
  )
    .then(updated => res.json(updated))
    .catch(err => res.status(500).json(err));
});

module.exports = router;