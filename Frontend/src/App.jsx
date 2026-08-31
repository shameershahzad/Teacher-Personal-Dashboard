import './App.css'
import TokenExpire from './Authentication/TokenExpire'
import Login from "./Authentication/Login"
import SignUp from "./Authentication/SignUp"
import Dashboard from './Components/Dashboard'
import Layout from "./Components/Layout"
import Classes from './Pages/Classes'
import Attendance from './Pages/Attendance'
import EditClass from './Pages/EditClass'
import AddClass from './Pages/AddClass'
import EditStudents from './Pages/EditStudents'
import Students from "./Pages/Students"
import EditTimeTable from './Pages/EditTimeTable'
import AddStudents from './Pages/AddStudents'
import TimeTable from "./Pages/TimeTable"
import AddTimeTable from './Pages/AddTimeTable'
import MarkAttendance from './Pages/MarkAttendance'
import EditAttendance from './Pages/EditAttendance'
import { Routes,Route } from "react-router-dom"
import ForgotPassword from './Pages/ForgotPassword'


function App() {
  return (
    <>
    <TokenExpire />

    <Routes>
      <Route path = "/" element={<Login />}/>
      <Route path = "/signUp" element={<SignUp />}/>
      <Route path = "/forgotPassword/:email" element={<ForgotPassword />}/>

      <Route element={<Layout />}>
        <Route path = "/dashboard" element={<Dashboard />}/>
        <Route path = "/classes" element={<Classes />}/>
        <Route path = "/addStudents" element={<AddStudents />}/>
        <Route path = "/attendance" element={<Attendance />}/>
        <Route path = "/addClass" element={<AddClass />}/>
        <Route path = "/editClass/:id" element={<EditClass />}/>
        <Route path = "/students" element={<Students />}/>
        <Route path = "/editStudents/:id" element={<EditStudents />}/>
        <Route path = "/timetable" element={<TimeTable />}/>
        <Route path = "/addtimetable" element={<AddTimeTable />}/>
        <Route path = "/editTimetable/:id" element={<EditTimeTable />}/>
        <Route path = "/markAttendance" element={<MarkAttendance />}/>
        <Route path = "/editAttendance/:id" element={<EditAttendance />}/>
      </Route>
    </Routes>
    </>
  );  
}

export default App;
