import React from 'react'
import { useState,useEffect } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import axios from 'axios';
import "./AddStudents.css"
import { API_URL } from "../config";

function EditStudents() {
    const {id} = useParams();
    const nav = useNavigate()
    const [sendClasses] = useState([])
    const [message,setMessage] = useState('')
    const [editStudent, seteditStudent] = useState({ fullName: '',rollNo: '',gender: '',parentcontact: '',
    attendance:'',class:'',admissionDate:''
  });
   const [originalStudent, setoriginalStudent] = useState({ fullName: '',rollNo: '',gender: '',parentcontact: '',
    attendance:'',class:'',admissionDate:''
  });
  const token = localStorage.getItem("token");

if(sendClasses == editStudent){
    setMessage("Nothing update")
}


useEffect(() => {
  axios.get(`${API_URL}/studentData/prevStudent/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
 .then(res => { 
  seteditStudent({
    fullName: res.data.fullName,
    rollNo: res.data.rollNo,
    gender: res.data.gender,
    parentcontact: res.data.parentcontact,
    attendance: res.data.attendance,
    class: res.data.class,
    admissionDate: res.data.admissionDate
  });
   setoriginalStudent({
    fullName: res.data.fullName,
    rollNo: res.data.rollNo,
    gender: res.data.gender,
    parentcontact: res.data.parentcontact,
    attendance: res.data.attendance,
    class: res.data.class,
    admissionDate: res.data.admissionDate
  });
})
  .catch(err => {
    console.log(err);
    setMessage("Failed to load student. Try Again!");
    setTimeout(() => {
      nav("/students");
    },1500)
  });
}, [token,id,nav]);



  const editData = (e) => {
   e.preventDefault();
  const token = localStorage.getItem("token");
  if(editStudent.fullName === originalStudent.fullName && editStudent.rollNo === originalStudent.rollNo &&
    editStudent.gender === originalStudent.gender && editStudent.parentcontact === originalStudent.parentcontact &&
    editStudent.attendance === originalStudent.attendance && editStudent.class === originalStudent.class &&
    editStudent.admissionDate === originalStudent.admissionDate){
    setMessage("Nothing update")
    setTimeout(() => {
      nav("/students")
    },1500)
  }
else{
  axios.put(`${API_URL}/studentData/editStudent/${id}`,editStudent, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(() => {
    setMessage("✅ Student updated");
     setTimeout(() => {
      nav("/students");
    },1500)
  })
  .catch(err => {
    console.log(err);
    setMessage("Update failed.Try Again!");
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
      <div className="studentDiv">
      <h2 style={{textAlign:"center",marginTop:"-5px"}}>Edit Student</h2>
      <form onSubmit = {editData}>
        <input type = "text" placeholder="Full Name..." value = {editStudent.fullName} onChange={(e) =>  seteditStudent({...editStudent,fullName:e.target.value})}/>
        <input type = "text" placeholder="Roll No..." value = {editStudent.rollNo} onChange={(e) =>  seteditStudent({...editStudent,rollNoe:e.target.value})}/>
        <select className="dropdown" value = {editStudent.gender} onChange={(e) =>  seteditStudent({...editStudent,gender:e.target.value})}>
          <option value="" disabled>Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input type = "tel" placeholder="Parent Contact.." value = {editStudent.parentcontact} onChange={(e) =>  seteditStudent({...editStudent,parentcontact:e.target.value})}/>
        <input type = "tel" placeholder = "Attendance" value = {editStudent.attendance} readOnly />
    
      <input type = "date" placeholder="Admission Date" value = {editStudent.admissionDate?.split("T")[0] || ""}
       onChange={(e) =>  seteditStudent({...editStudent,admissionDate:e.target.value})} />  
        <button className="addBtn" type = "submit">Update</button>
      </form>
    </div>
    </>
  )
}

export default EditStudents
