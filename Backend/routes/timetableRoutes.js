const express = require("express")
const verifyToken = require("../middleware/verifyToken")
const timetableModel = require("../model/timetableModel");



const router = express.Router();

router.post("/addTimetable",verifyToken,(req,res) => {
    req.body.userId = req.userId;
    timetableModel.create(req.body)
    .then((result) => res.status(200).json({data:result,mesaage:"Time added!"}))
    .catch((err) => res.status(404).json(err))
})

router.get("/showTimetable", verifyToken, async (req, res) => {
  const { class: cls, section } = req.query;

  try {
    const data = await timetableModel.find({ class: cls, section: section, userId: req.userId });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete("/deleteTimeTable/:id",verifyToken,(req,res) => {
    timetableModel.findOneAndDelete({ _id: req.params.id, userId: req.userId })
    .then(deleted => res.json({ message: "Deleted successfully", deleted }))
    .catch(err => res.status(500).json(err));
})

router.get("/prevTimetable/:id",verifyToken,(req,res) => {
    const { id } = req.params;
 
  timetableModel.findOne({_id:id,userId:req.userId})   
    .then(result => {
      if (!result) {
        return res.status(404).json({ message: "Subject  not found" });
      }
      res.json(result);
    })
    .catch(err => res.status(500).json({ error: err.message }));
})

// Correct RESTful format with route params
router.get("/showsectionOfClassOnEdit/:class/:section/:id", verifyToken, async (req, res) => {
  const { class: cls, section, id } = req.params;

  try {
    const subjectList = await timetableModel.find({ class: cls, section, userId: req.userId });

    if (!subjectList || subjectList.length === 0) {
      return res.status(404).json({ message: "No subjects found" });
    }

    const uniqueSubjects = [...new Set(subjectList.map(item => item.subject))];

    res.status(200).json({ SubjectList: uniqueSubjects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put("/editTimetable/:id",verifyToken,(req,res) => {
    timetableModel.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body // update data you send from frontend
  )
    .then(updated => res.json(updated))
    .catch(err => res.status(500).json(err));
})

module.exports = router;