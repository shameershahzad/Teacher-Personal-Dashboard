import React, { useState,useEffect } from 'react'
import axios from 'axios'
import "./AddClass.css"
import { useNavigate } from 'react-router-dom'
import { API_URL } from "../config";

function AddClass() {
 const [classes,setClasses] = useState('')
 const [section,setSection] = useState('')
 const [subject,setSubject] = useState('')
 const [studentEnroll] = useState(0)
 const [message,setMessage] = useState('')
 const nav = useNavigate()

 const handleSubmit = (e) => {
    e.preventDefault();
   const token = localStorage.getItem("token")

    if(!token){
      setMessage("Login again");
      setTimeout(() => {
        nav("/")
      },1500)
    }
    if (!classes || !section || !subject  ) {
  setMessage('All fields are required.');
  return;
}
     const sendClasses={class:classes,section,subject,studentEnroll}
        axios.post(`${API_URL}/class/addClasses`,sendClasses,{
            headers:{Authorization:`Bearer ${token}`}
        })
        .then((result) => {
            console.log(result)
            setMessage("✅ Class added!")
            setTimeout(() => {
              nav("/classes")
            },1500)
           
        }).catch((err) => {
            console.log("Error:",err)
            setMessage("Error occured!");
            setSection('')
            setSubject('')
            setClasses('')

        })   
 }

  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timeout);
    }
  }, [message]);
  return (
    <>
      {message && (
       <div className="message-box"  style={{ color: message.startsWith("✅") ? "#4CAF50" : "red" }} >
        {message}
       </div>
      )}
    <div className='add-class-card'>
     <h1>Add Class</h1> 
      <form onSubmit={handleSubmit}>
        <input type="tel" placeholder='Class...' value={classes} onChange={(e) => setClasses(e.target.value)} />
        <input type="text" placeholder='Section...' value={section} onChange={(e) => setSection(e.target.value)}/>
        <input type="text" placeholder='Subject...'value={subject}  onChange={(e) => setSubject(e.target.value)}/>
        <input type="number" value={studentEnroll} readOnly  />
        <button type="submit">Add Class</button>
      </form>

    </div>
    </>
  )
}

export default AddClass
