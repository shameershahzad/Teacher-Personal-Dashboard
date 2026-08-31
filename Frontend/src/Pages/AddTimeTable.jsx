import React,{useState,useEffect} from 'react'
import "./AddTimeTable.css"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { API_URL } from "../config";

function AddTimeTable() {
    const [receiveData,setreceiveData] = useState([])
    const [allSectionOfClass,setallSectionOfClass] = useState([])
    const [selectSubjectOfSection,setselectSubjectOfSection] = useState([])
    const [selectSection,setselectSection] = useState('')
    const [selectSubject,setselectSubject] = useState('')
    const [selectClassValue,setselectClassValue] = useState('')
    const [message,setMessage] = useState('')
    const [day,setDay] = useState('') 
    const [time,setTime] = useState('')
    
    const token = localStorage.getItem("token")
    const nav = useNavigate()
    
useEffect(() => {
      axios.get(`${API_URL}/class/sendDataOnAddTimeTable`,{headers:{Authorization:`Bearer ${token}`}})
      .then((result) => {
        if(result){
          console.log(result)
          setreceiveData(result.data)
        }
        else{
          setMessage("No class found")
        }
      })
      .catch((err) => {
        console.log("Error:",err)
        setMessage("Error fetching data");
      })
    },[token])

    const handleClass = (e) => {
    const selectClass = e.target.value;
    setselectClassValue(selectClass);

    // Fix: ensure both sides are string and trimmed for matching
    const selectSectionForClass = receiveData
      .filter(prev => String( prev.class) === String(selectClass))
      .map(item => item.section);
   const uniqueSections = [...new Set(selectSectionForClass)]
    setallSectionOfClass(uniqueSections);
  };

  const hanldeSection = (e) => {
    const selectSec = e.target.value;
    setselectSection(selectSec)

   const subjects = receiveData
    .filter(prev => String(prev.class) === String(selectClassValue) && String(prev.section) === String(selectSec))
    .map(item => item.subject)
    setselectSubjectOfSection(subjects)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!selectClassValue || !time || !selectSection || !selectSubject || !day){
      setMessage("All fields are required")
      return;
    }
      else{
        const timeTable = {class:selectClassValue,time,section:selectSection,subject:selectSubject,day}
     axios.post(`${API_URL}/times/addTimetable`,timeTable,{headers:{Authorization:`Bearer ${token}`}})
     .then((result) => {
        console.log(result.data)
        setMessage("✅Time table added!")
        setTimeout(() => {
          nav("/timetable")
        },1500)
     }).catch((err) => {
       console.log("Err:",err)
        setMessage("Error occured!");
    })}
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
   <div className='add-time-card'>
     <h1>Add Time Table</h1> 
      <form onSubmit = {handleSubmit}>
        <select className='Drop-down'value = {selectClassValue} onChange={handleClass}>
        <option value = "" disabled >Select Class</option>
          {[...new Set(receiveData.map(cls => cls.class))].map((cls, index) => (
      <option key={index} value={cls}>{cls}</option>))}
      </select>
      <input type="text" placeholder='E.g:9:00 AM - 10:00 AM' value={time} onChange={(e) => setTime(e.target.value)}/>
      <select disabled = {!selectClassValue} className='Drop-down'  value = {selectSection}
       onChange={hanldeSection} style={{marginTop:"2px"}}>
        <option value="" disabled>Select Section</option>
        {allSectionOfClass.map((sec,i) => (
          <option key = {i} value={sec}>{sec}</option>
        ))}
      </select>
      <select className='Drop-down' disabled={!selectSection} value = {selectSubject}
        style={{marginTop:"3px"}} onChange={(e) => setselectSubject(e.target.value)} >
             <option value="" disabled>Select Subject</option>
        {selectSubjectOfSection.map((sbj,i) => (
          <option key = {i} value={sbj}>{sbj}</option>
        ))}
      </select>
        <select value = {day} className='Drop-down' onChange={(e) => setDay(e.target.value)} style={{marginTop:"2px"}} >
            <option value = "" disabled>Select Day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
        </select>
        <button className="addBtn" type="submit">Add Time</button>
        </form>
    </div> 

    </>
  )
}

export default AddTimeTable
