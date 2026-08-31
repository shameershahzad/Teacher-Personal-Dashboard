import React from 'react'
import "./Navbar.css"
import { useNavigate,NavLink } from 'react-router-dom';

function Navbar() {
  const nav = useNavigate()
 
  const signUp = () => {
     localStorage.removeItem("token");
     localStorage.removeItem("refreshToken");
     console.log("Token Deleted")
    nav("/")
  }
  return (
    <>
     <div className='navDiv'>
  <img src="/Logo.ico" alt="App Icon" width={70} height={62}  style={{ marginLeft: '10px',marginTop:"6px" }}  />
      <h2 style={{fontSize:"30px",marginLeft:"-3px",marginTop:"23px"}}><i>NexEd</i></h2>
      <div className='pagesDiv'>
        <NavLink className={({isActive }) => isActive? "nav-link active" : "nav-link"} to="/dashboard">🏠 Dashboard</NavLink>
        <NavLink className={({isActive }) => isActive? "nav-link active" : "nav-link"} to ="/classes"> 🏫 Classes</NavLink> 
        <NavLink className={({isActive }) => isActive? "nav-link active" : "nav-link"} to ="/students">👨‍🎓  Students</NavLink> 
        <NavLink className={({isActive }) => isActive? "nav-link active" : "nav-link"} to ="/attendance">✅ Attendance</NavLink>
        <NavLink className={({isActive }) => isActive? "nav-link active" : "nav-link"} to = "/timetable">📅 Time Table</NavLink> 
      </div>
      <div className='buttonDiv'>
        
        <button className='signUpBtn' onClick={signUp}>Log Out</button>
      </div>
     </div>
    </>
  )
}

export default Navbar
