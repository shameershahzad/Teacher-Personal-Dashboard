const express = require("express");
const verifyToken = require("../middleware/verifyToken")
const attendanceModel = require("../model/attendanceModel");
const router = express.Router();

router.post("/saveAttendance",verifyToken,async(req,res) => {
  
try{
const attendanceArray = req.body
  const attendanceWithUserId = attendanceArray.map(entry => ({
    ...entry,
    userId: req.userId
  }));

    await attendanceModel.insertMany(attendanceWithUserId)
    res.status(200).json({message:"Attendance saved successfully!"})

}catch(err){
    res.status(404).json({error:err})
}
})

router.get("/sendClassSectionOnAttendance",verifyToken,async(req,res) => {
  try{ 
      const attendanceList = await attendanceModel.aggregate([
       { 
        $match:{userId:req.userId}
      },{
        $group:{_id:{class:"$class",section:"$section",date:"$date"}}
      },{
        $sort:{class:1,section:1,date:1}
      } 
      ])
  const uniqueCombinations = attendanceList.map(item => ({
  class: item._id.class,
  section: item._id.section,
  date: item._id.date
}));
res.json(uniqueCombinations);
}catch(err){
  res.status(404).json({Error:err})
} 
})

router.get("/showStudents/:class/:section/:date", verifyToken, async (req, res) => {
  const cls = parseInt(req.params.class);
  const section = req.params.section;
  const date = req.params.date;

  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  try {
    const studentList = await attendanceModel.aggregate([
      {
        $match: {
          class: cls,
          section: section,
          userId: req.userId,
          date: { $gte: start, $lte: end }
        }
      },
      {
        $project: {
         _id: 1,
         fullName: 1,
         rollNo: 1,
         section: 1,
         class: 1,
         status: 1,
         date: 1
        }
      },
      { $sort: { rollNo: 1 } }
    ]);
    res.status(200).json(studentList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/showMarkedAttendanceDate",verifyToken,(req,res) => {
  attendanceModel.find({userId:req.userId},{date:1,class:1,section:1}).sort({date:-1})
  .then(result => res.status(200).json(result))
  .catch(err => res.status(404).json(err))
})

router.get("/prevAttendance/:id",verifyToken,(req,res) => {
 const { id } = req.params;

  attendanceModel.findOne({ _id: id, userId: req.userId })
    .then(result => {
      if (!result) {
        return res.status(404).json({ message: "Student attendance not found" });
      }
      res.json(result);
    })
    .catch(err => res.status(500).json({ error: err.message }));
})

router.put("/editAttendance/:id", verifyToken, (req, res) => {
  attendanceModel.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body // update data you send from frontend
  )
    .then(updated => res.json(updated))
    .catch(err => res.status(500).json(err));
});
router.get("/percentage/:class/:section", verifyToken, async (req, res) => {
  const { class: cls, section } = req.params;

  try {
    const report = await attendanceModel.aggregate([
      {
        $match: {
          class: parseInt(cls),
          section: section,
          userId: req.userId
        }
      },
      {
        $group: {
          _id: "$rollNo",
          fullName: { $first: "$fullName" },
          totalDays: { $sum: 1 },
          presentDays: {
           $sum: {
         $switch: {branches: [
                 { case: { $eq: ["$status", "present"] }, then: 1 },
                 { case: { $eq: ["$status", "leave"] }, then: 0.5 }
    ], default: 0
  }
}

          }
        }
      },
      {
        $project: {
          fullName: 1,
          rollNo: "$_id",
          totalDays: 1,
          presentDays: 1,
          percentage: {
            $round: [{ $multiply: [{ $divide: ["$presentDays", "$totalDays"] }, 100] }, 2]
          }
        }
      },
      {
        $sort: { rollNo: 1 }
      }
    ]);

    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to calculate attendance percentage" });
  }
});

router.delete("/deleteStudentAttendance/:rollNo",verifyToken,(req,res) => {
   attendanceModel.deleteMany({ rollNo: req.params.rollNo, userId: req.userId })
    .then(deleted => res.json({ message: "Deleted successfully attendance", deleted }))
    .catch(err => res.status(500).json(err));
})


module.exports = router;