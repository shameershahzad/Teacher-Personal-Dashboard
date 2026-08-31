import React, { useEffect, useState } from "react";
import "./AddStudents.css" 
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const AddStudents = () => {
 const [sendClasses,setsendClasses] = useState([])
 const [allSectionOfClass,setallSectionOfClass] = useState([])
 const [selectClassValue,setselectClassValue] = useState('')
 const [fullName,setfullName] = useState('')
 const [rollNo,setrollNo] = useState('')
 const [gender,setGender] = useState('')
 const [parentcontact,setparentContact] = useState('')
 const [attendance] = useState(0)
 const [admissionDate,setadmissionDate] = useState('')
 const [selectedSection,setselectedSection] = useState('')
 const [message,setMessage] = useState('')
 
  const nav= useNavigate()

useEffect(() => {
  const token = localStorage.getItem("token");

  axios.get(`${API_URL}/class/sendClassesOnStudent`,{headers:{Authorization:`Bearer ${token}`}})
  .then((result) => {
    if(result.data.message === "Classes found!"){
      console.log(result)
      setsendClasses(result.data.result)
    }
    else{
      setMessage("No class found")
    }
  })
  .catch((err) => {
    console.log("Error:",err)
    setMessage("Error fetching data");
  })
},[])


const handleSubmit = (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token")
  
  if (!fullName || !rollNo || !gender || !parentcontact  || !selectClassValue || !admissionDate || !selectedSection ) {
  setMessage('All fields are required.');
}
else if(parentcontact.length !== 11){
 setMessage("Contact number must be 11 digit.")
}
else{
  const sendStudent = {fullName,rollNo,gender,parentcontact,attendance,class:selectClassValue,section:selectedSection,admissionDate}
  axios.post(`${API_URL}/studentData/addStudent`,sendStudent,{headers:{Authorization:`Bearer ${token}`}})
  .then((result) => {
    console.log(result)
    setMessage("✅ Student added")
    setTimeout(() => {
      nav("/students")
    },1500)
  })
  .catch((err) => {
    console.log("Err:",err)
   setMessage("Error occured!"); 
  })}
}

const handleContact = (e) => {
  const value = e.target.value;

  if (/^\d*$/.test(value)) {
    setparentContact(value);
  }  
  }

  const handleClass = (e) => {
  const selectClass = e.target.value;
  setselectClassValue(selectClass);

  // Fix: ensure both sides are string and trimmed for matching
  const selectSectionForClass = sendClasses
    .filter(prev => String( prev.class) === String(selectClass))
    .map(item => item.section);
  setallSectionOfClass(selectSectionForClass);
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
      <h2 style={{textAlign:"center",marginTop:"-5px"}}>Add Student</h2>
      <form onSubmit = {handleSubmit}>
        <input type = "text" placeholder="Full Name..." value = {fullName} onChange={(e) => setfullName(e.target.value)}/>
        <input type = "text" placeholder="Roll No..." value = {rollNo} onChange={(e) => setrollNo(e.target.value)}/>
        <select className="dropdown" value = {gender} onChange={(e) => setGender(e.target.value)}>
          <option value="" disabled>Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        
        <input type = "tel" placeholder="Parent Contact.." value = {parentcontact} onChange={handleContact}/>
        <input type = "tel" placeholder = "Attendance" value = {attendance} readOnly />
       <select className='dropdown' value = {selectClassValue} onChange={handleClass}>
        <option value = "" disabled >Select Class</option>
          {[...new Set(sendClasses.map(cls => cls.class))].map((cls, index) => (
    <option key={index} value={cls}>{cls}</option>))}
      </select>
      <select disabled = {!selectClassValue} className='dropdown' value = {selectedSection}
       onChange={(e) => setselectedSection(e.target.value)} >
        <option value="" disabled>Select Section</option>
        {[...new Set(allSectionOfClass)].map((sec,i) => (
          <option key = {i} value={sec}>{sec}</option>
        ))}
      </select>
      <input type = "date" placeholder="Admission Date" value = {admissionDate} onChange={(e) => setadmissionDate(e.target.value)} />  
        <button className="addBtn" type = "submit">Add Student</button>
      </form>
    </div>
    </>
  );
};

export default AddStudents;
