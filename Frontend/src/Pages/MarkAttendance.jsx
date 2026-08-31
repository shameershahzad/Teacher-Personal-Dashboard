import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MarkAttendance.css"
import { API_URL } from "../config";

const MarkAttendance = () => {
  const [receiveData, setreceiveData] = useState([]);
  const [selectClass, setselectClass] = useState('');
  const [allSectionOfClass, setallSectionOfClass] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [allStudentsByClass, setallStudentsByClass] = useState([]);
  const [statuses,setStatuses] = useState({})
  const [message,setMessage] = useState('')
  const [attendanceMarkedDate,setattendanceMarkedDate] = useState([])
  const [attendanceDate,setattendanceDate] = useState(() => {
  return new Date().toISOString().split("T")[0]; // e.g., "2025-07-26"
})

    const token = localStorage.getItem("token")

      useEffect(() => {
    axios.get(`${API_URL}/class/sendClassesOnAttendance`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((result) => {
      if (result.data.length > 0) {
        setreceiveData(result.data);
      } else {
        setMessage("No class found");
      }
    })
    .catch((err) => {
      console.log("Error:", err);
      setMessage("Error fetching data");
    });
  }, [token]);

  useEffect(() => {
    axios.get(`${API_URL}/attendance/showMarkedAttendanceDate`,{headers:{Authorization:`Bearer ${token}`}})
    .then((result) => {
       console.log("Attendance Date",result.data)
       setattendanceMarkedDate(result.data)
    })
    .catch((err) => {
      console.log("Error:",err)
      setMessage("Error fetching data");
    })
  },[token])


  const handleClassChange = (e) => {
    const selected = e.target.value;
    setselectClass(selected);
    setSelectedSection('');
    setallStudentsByClass([]);

    const sections = receiveData
      .filter(item => String(item.class) === String(selected))
      .map(item => item.section);
    
      const uniqueSections = [...new Set(sections)]
    setallSectionOfClass(uniqueSections);
  };

  const handleSectionChange = (e) => {
    const section = e.target.value;
    setSelectedSection(section);

       axios.get(`${API_URL}/class/showStudents?class=${selectClass}&section=${section}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((result) => {
      if (result.data.length > 0) {
        console.log("Section and class:",result.data)
        setallStudentsByClass(result.data);
      } else {
        setMessage("No student Found!");
        setallStudentsByClass([]);
      }
    })
    .catch((err) => {
      console.log("Error:", err);
      setMessage("Error fetching data");
    });
  };

  const submitAttendance = () => {
    const selectedDateStr =  new Date(attendanceDate).toDateString();

  const alreadyMarked = attendanceMarkedDate.some(att => (
    String(att.class) === String(selectClass) &&
    String(att.section) === String(selectedSection) &&
      new Date(att.date).toDateString() === selectedDateStr
  ));

  if (alreadyMarked) {
    setMessage(`Attendance already marked today for class ${selectClass}-${selectedSection}`);
    setselectClass('')
    setSelectedSection('')
    setallStudentsByClass([])
     return;
  }
    else if(allStudentsByClass.some(std => !statuses[std.rollNo])){
      setMessage("Please select a status for every student");
    }
    else{
      const sendAttendance = allStudentsByClass.map(std => (
        {fullName:std.fullName,   rollNo:std.rollNo,
         class:selectClass,       section:selectedSection,
         status:statuses[std.rollNo],  date:selectedDateStr
        }
      ))
        axios.post(`${API_URL}/attendance/saveAttendance`,sendAttendance,{headers:{Authorization:`Bearer ${token}`}})
        .then((result) =>
          {
            console.log(result);
          setMessage("✅ Attendance marked successfully!")
          setselectClass('')
          setSelectedSection('')
          setallStudentsByClass([])
          setStatuses({})
          
          // refresh marked attendance
          axios.get(`${API_URL}/attendance/showMarkedAttendanceDate`, {
           headers: { Authorization: `Bearer ${token}` }
          }).then(res => setattendanceMarkedDate(res.data));
          } )
        .catch((err) => {
          console.log("Error:",err)
           setMessage("Error occur!"); }
      )}
      
}

   useEffect(() => {
     if (message) {
       const timeout = setTimeout(() => setMessage(''), 3000);
       return () => clearTimeout(timeout);
     }
   }, [message]);

  return(
    <>
    {message && (
      <div className="message-popup" style={{ color: message.startsWith("✅") ? "#4CAF50" : "red" }} >
        {message}
      </div>
    )}
     <select className='Drop_Down' value={selectClass} onChange={handleClassChange} style={{marginTop:"10px",marginLeft:"32%"}}>
        <option value="" disabled>Select Class</option>
        {[...new Set(receiveData.map(cls => cls.class))].map((cls, index) => (
          <option key={index} value={cls}>{cls}</option>
        ))}
      </select>

      {/* Section Select */}
      <select disabled={!selectClass} className='Drop_Down' style={{ marginLeft: "70px" }}
        value={selectedSection} onChange={handleSectionChange}>
        <option value="" disabled>Select Section</option>
        {allSectionOfClass.map((sec, i) => (
          <option key={i} value={sec}>{sec}</option>
        ))}
      </select><br/>
      <input type = "date" value ={attendanceDate} className = "input_field" style = {{marginLeft:"43%"}}
       onChange={(e) => setattendanceDate(e.target.value)} />
 <div className="tableContainer">
        <table className="table">
          <thead>
            <tr>
               <th>Full Name</th>
              <th>Roll No</th>
              <th>Class</th>
              <th>Section</th>
              <th>Status</th>
              <th>Attd. Date</th>
            </tr>
          </thead>
          <tbody>
            
            {allStudentsByClass.map((value, index) => (
              <tr key={index}>
                <td>{value.fullName}</td>
                <td>{value.rollNo}</td>
                <td>{value.class}</td>  
                <td>{value.section}</td>
                <td>
                <select value = {statuses[value.rollNo] || ""}  onChange={(e) =>
                  setStatuses((prev) => ({ ...prev,[value.rollNo]: e.target.value}))}
                className="Drop_Down" style = {{width:"140px",fontSize:"16px"}} >
                  <option value="" disabled>Select status</option>
                     <option value = "present">present</option>
                     <option value = "absent">absent</option>
                     <option value = "leave">leave</option>
                </select>
                </td>
                <td>{attendanceDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        <button className = "saveBtn" onClick = {submitAttendance} 
        disabled = {!selectClass || !selectedSection || allStudentsByClass.length === 0}>Submit</button>
    </>
  );
};

export default MarkAttendance;
