import React from 'react'

import {useState,useEffect} from "react"
import { useParams,useNavigate } from 'react-router-dom';
import axios from "axios"
import { API_URL } from "../config";

function EditTimeTable() {

    const {id} = useParams();
    const nav = useNavigate()
    const [selectSubject,setselectSubject] = useState([])
    const [message,setMessage] = useState('')
    const [originalTimetable,setoriginalTimetable] = useState({class:'',  time: '' ,section:'',subject: '', day: ''})
    const [editTimetable, seteditTimetable] = useState({ class:'',  time: '' ,section:'',subject: '', day: ''});

  const token = localStorage.getItem("token");

 useEffect(() => {
  axios.get(`${API_URL}/times/prevTimetable/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
 .then(res => { 
  console.log(res)
  seteditTimetable({
    class: res.data.class,
    time:res.data.time,
    section:res.data.section,
    subject:res.data.subject,
    day:res.data.day
  });
  setoriginalTimetable({
    class: res.data.class,
    time:res.data.time,
    section:res.data.section,
    subject:res.data.subject,
    day:res.data.day
  });
})
  .catch(err => {
    console.log(err);
    setMessage("Failed to load time table. Try Again!");
    setTimeout(() => {
      nav("/timetable");
    },2000)
  });
}, [token,id,nav]);


useEffect(() => {
  if(editTimetable.class && editTimetable.section){
   axios.get(`${API_URL}/times/showsectionOfClassOnEdit/${editTimetable.class}/${editTimetable.section}/${id}`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
      .then((result) => {
        console.log("Subject:",result.data.SubjectList)
   setselectSubject(result.data.SubjectList); 

      }).catch((err => {
        console.log("Error:",err)
        setMessage("Error fetching data");
      }))  

 }
},[editTimetable.class, editTimetable.section,id,token])


  const editData = (e) => {
    e.preventDefault();
  const token = localStorage.getItem("token");
    if(editTimetable.class === originalTimetable.class && editTimetable.time === originalTimetable.time &&
    editTimetable.section === originalTimetable.section && editTimetable.subject === originalTimetable.subject &&
    editTimetable.day === originalTimetable.day ) {
      setMessage("Nothing update")
      setTimeout(() => {
        nav("/timetable")
      },1500)
  }
else{
  axios.put(`${API_URL}/times/editTimetable/${id}`,editTimetable, {
    headers: {
      Authorization:`Bearer ${token}`
    }
  })
  .then(() => {
    setMessage("✅ Time table updated");
    setTimeout(() => {
      nav("/timetable");
    },1500)
  })
  .catch(err => {
    console.log(err);
    setMessage("Update failed. Try again!");
  });

}
};

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
      <div className='add-time-card'>
     <h1>Edit Time Table</h1> 
      <form onSubmit={editData}>
       <input type = "text" value = {editTimetable.class} readOnly />
      <input type="text" placeholder='E.g:9:00 AM - 10:00 AM...' value={editTimetable.time} onChange={(e)=> seteditTimetable({...editTimetable,time:e.target.value})}/>
       <input type = "text" value = {editTimetable.section} readOnly />
      <select className='Drop-down' value = {editTimetable.subject}
        style={{marginTop:"3px"}} onChange={(e) => seteditTimetable({...editTimetable,subject:e.target.value})} >
             <option value="" disabled>Select Subject</option>
        {selectSubject.map((sbj,i) => (
          <option key = {i} value={sbj}>{sbj}</option>
        ))}
      </select>
        <select value = {editTimetable.day} className='Drop-down' onChange={(e)=> seteditTimetable({...editTimetable,day:e.target.value})} style={{marginTop:"2px"}} >
            <option value = "" disabled>Select Day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
        </select>
        <button className="addBtn" type="submit">Update</button>
        </form>
    </div>  
    </>
  )
}

export default EditTimeTable
