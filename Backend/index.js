const express = require("express");
const cors = require("cors")
const connectDB = require("./config/db");
const registerRoutes = require("./routes/registerRoutes");
const classRoutes = require("./routes/classRoutes")
const studentRoutes = require("./routes/studentRoutes")
const timetableRoutes = require("./routes/timetableRoutes")
const attendanceRoutes = require("./routes/attendanceRoutes")
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json({ message: "Teacher Personal Dashboard API is running!" });
})

app.use("/register",registerRoutes)
app.use("/class",classRoutes)
app.use("/studentData",studentRoutes)
app.use("/times",timetableRoutes)
app.use("/attendance",attendanceRoutes)

// Export for Vercel (serverless) - do NOT call app.listen() for production
module.exports = app;

// Only listen locally when running with node/nodemon directly
if (process.env.NODE_ENV !== "production") {
    const port = process.env.PORT || 3003;
    app.listen(port,() => {
        console.log(`Server is running at port: ${port}`)
    })
}
