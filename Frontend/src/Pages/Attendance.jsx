import { API_URL } from "../config";
  import React from 'react'
  import "./Attendance.css"
  import axios from 'axios'
  import {useState,useEffect} from "react"
  import {useNavigate} from "react-router-dom"


  function Attendance() {

        const [receiveData, setreceiveData] = useState({});
        const [selectClass, setselectClass] = useState('');
        const [allSectionOfClass, setallSectionOfClass] = useState([]);
        const [allDateofAttendance,setallDateofAttendance] = useState([])
        const [allStudentsofAttendance, setallStudentsofAttendance] = useState([]);
        const [selectedSection,setSelectedSection] = useState('')
        const [selectDate,setselectDate] = useState('')
        const [filteredStd,setfilteredStd] = useState([])
        const [inputStd,setinputStd] = useState('')
        const [message,setMessage] = useState('')
        const nav = useNavigate();
        const receiveDataArray = Object.values(receiveData) // Convert to Array
            
      const token = localStorage.getItem("token")

        useEffect(() => {
      axios.get(`${API_URL}/attendance/sendClassSectionOnAttendance`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((result) => {
        if (result.data.length > 0) {
          setreceiveData(result.data);
          console.log("Result:",result.data)
        } else {
          setMessage("No attendance exist of any class");
        }
      })
      .catch((err) => {
        console.log("Error:", err);
      });
    }, [token]);

    
    const handleClassChange = (e) => {
      const selected = e.target.value;
      setselectClass(selected);
      setSelectedSection('');
      setallStudentsofAttendance([])

      const sections = receiveDataArray
        .filter(item => String(item.class) === String(selected))
        .map(item => item.section);

      const uniqueSections = [...new Set(sections)]
      setallSectionOfClass(uniqueSections);
    };

    const handleSectionChange = (e) => {
      const sec = e.target.value;
      setSelectedSection(sec);

      const dates = receiveDataArray.filter(item => String(item.class) === String(selectClass) && String(item.section) === String(sec))
        .map(item => item.date)
      
        const uniqueDates = [...new Set(dates)]

        setallDateofAttendance(uniqueDates)

    };

    const handleDateChange = (e) => {
      const date = e.target.value;
      setselectDate(date);
    

    axios.get(`${API_URL}/attendance/showStudents/${selectClass}/${selectedSection}/${date}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((result) => {
        if (result.data.length > 0) {
          console.log("Section and class:",result.data)
          setallStudentsofAttendance(result.data);
        } else {
          console.log("No student Found!");
          setallStudentsofAttendance([]); 
        }
      })
      .catch((err) => {
        console.log("Error:", err);
      });
        
    }

     const handlefindStd = (e) => {
    const inpt = e.target.value.toLowerCase();
    setinputStd(inpt)

   const filtered = allStudentsofAttendance.filter(std => std.rollNo.toLowerCase().includes(inpt))
  setfilteredStd(filtered)
  console.log(filteredStd)
  }

  const editData = (id) => {
    nav(`/editAttendance/${id}`)
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
      <div className="message-Popup" style={{ color: message.startsWith("✅") ? "#4CAF50" : "red" }} >
        {message}
      </div>
      )}
            {/* Class Select */}
        <select className='drop_down' value={selectClass} onChange={handleClassChange} style = {{marginLeft:"30%",marginTop:"10px"}}>
          <option value="" disabled>Select Class</option>
          {[...new Set(receiveDataArray.map(cls => cls.class))].map((cls, index) => (
            <option key={index}>{cls}</option>
          ))}
        </select>

        {/* Section Select */}
        <select disabled={!selectClass} className='drop_down' style={{ marginLeft: "80px" }}
          value={selectedSection} onChange={handleSectionChange}>
          <option value="" disabled>Select Section</option>
          {allSectionOfClass.map((sec, i) => (
            <option key={i} value={sec}>{sec}</option>
          ))}
        </select>
        <select type = "text" className='drop_down'
        value = {selectDate} onChange = {handleDateChange} style={{marginLeft:"30%",marginTop:"10px"}}  >
        <option value = "" disabled>Select Date</option>
          {allDateofAttendance.map((date,i) => {
            const formatted = new Date(date).toLocaleDateString("en-GB");
            return <option key = {i} value = {date}>{formatted}</option>
          })} 
        </select>
        <input type = "text" placeholder='Find Student By Roll No..'className='Input_Field'
      value = {inputStd} onChange = {handlefindStd} style={{marginLeft:"80px"}}  />
        <div className="Table_Container">
        <table className='table'>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Roll No</th>
              <th>Class</th>
              <th>Section</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
              {(inputStd? filteredStd: allStudentsofAttendance).map((value,i) => (
                <tr key = {i}>
                       <td>{value.fullName}</td>
                       <td>{value.rollNo}</td>
                       <td>{value.class}</td>
                       <td>{value.section}</td>
                       <td>{value.status}</td>
                       <td>
                        <button className = "edit-btn"onClick = {() => editData(value._id)}>Edit</button>
                       </td>
                </tr>
              ))}
          </tbody>
        </table>


        </div>


      </>
    )
  }

  export default Attendance
