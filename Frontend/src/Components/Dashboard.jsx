import React,{useEffect} from 'react';
import AutoMessage from '../Components/AutoMessage';
import "./Dashboard.css"
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  useEffect(() => {
      document.body.style.background = "linear-gradient(to right, #6a11cb, #2575fc)"
  },[]) 

  const nav = useNavigate();
  return (
    <>
    <div className="center-add-wrapper">
    <button className="add-class-button" onClick={() => nav("/addClass")}>+ Add Class</button>
    <button onClick = {() => nav("/addStudents")} className='addStudentsBtn'>+ Add Student</button>
    <button onClick = {() => nav("/addtimetable")} className='addStudentsBtn'>+ Add Timetable</button>
    <button onClick = {() => nav("/markAttendance")} className='addStudentsBtn'>+ Mark Attendance</button>
  </div>
      
<AutoMessage />
    </>

  );
};

export default Dashboard;
