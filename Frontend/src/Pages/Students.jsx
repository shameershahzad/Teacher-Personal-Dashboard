import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Students.css";
import axios from "axios";
import { API_URL } from "../config";

function Students() {
  const [receiveData, setreceiveData] = useState([]);
  const [selectClass, setselectClass] = useState('');
  const [allSectionOfClass, setallSectionOfClass] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [allStudentsByClass, setallStudentsByClass] = useState([]);
  const [inputStd,setinputStd] = useState('')
  const [filteredStd,setfilteredStd] = useState([])
  const [message,setMessage] = useState('')
  const [attendanceReport, setAttendanceReport] = useState([]);  
  const nav = useNavigate();
  const token = localStorage.getItem("token");
  console.log("Section:",allSectionOfClass[0])

  useEffect(() => {
    axios.get(`${API_URL}/class/sendClassesOnStudent`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((result) => {
      if (result.data.message === "Classes found!" ) {
        setreceiveData(result.data.result);
      } else{
        setMessage(`No student exist in class ${selectClass} - ${selectedSection}`)
        setselectClass('');
        setSelectedSection('');
      }
    })
    .catch((err) => {
      console.log("Error:", err);
      setMessage("Error fetching data"); 
    });
  },[token,selectClass,selectedSection]);

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
        setMessage(`No student exist in class ${selectClass}-${section}`)
        setselectClass('')
        setSelectedSection('')
        setallStudentsByClass([]);
      }
    })
    .catch((err) => {
      console.log("Error:", err);
      setMessage("Error fetching data");
    });
      
  };
useEffect(() => {
  if (selectClass && selectedSection) {
    axios.get(`${API_URL}/attendance/percentage/${selectClass}/${selectedSection}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      setAttendanceReport(res.data);
    })
    .catch((err) => {
      console.log("Error fetching attendance %", err);
    });
  }
}, [selectClass, selectedSection,token]);
  const editData = (id) => {
    nav(`/editStudents/${id}`);
  };

  const deleteData = (id,rollNo) => {
    axios.delete(`${API_URL}/studentData/deleteStudent/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(() => {
      setMessage(" ✅ Student Deleted");
      setallStudentsByClass(prev => prev.filter(item => item._id !== id));
    })
    .catch(err => {
      console.log(err);
      setMessage("Student not deleted.");
    });

    axios.delete(`${API_URL}/attendance/deleteStudentAttendance/${rollNo}`,{headers:{Authorization:`Bearer ${token}`}} )
    .then(() => {
      console.log("Student attendance deleted")
      setAttendanceReport(prev => prev.filter(item => item.rollNo !== rollNo));
    })
    .catch(err => {
         console.log(err);
    setMessage("Student attendance not deleted.");
    })
  };

  const handlefindStd = (e) => {
    const inpt = e.target.value.toLowerCase();
    setinputStd(inpt)

   const filtered = allStudentsByClass.filter(std => std.rollNo.toLowerCase().includes(inpt))
  setfilteredStd(filtered)
  console.log(filteredStd)
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
      <select className='dropDown' value={selectClass} onChange={handleClassChange} style = {{marginLeft:"30%",marginTop:"10px"}}>
        <option value="" disabled>Select Class</option>
        {[...new Set(receiveData.map(cls => cls.class))].map((cls, index) => (
          <option key={index} value={cls}>{cls}</option>
        ))}
      </select>

      {/* Section Select */}
      <select disabled={!selectClass} className='dropDown' style={{ marginLeft: "80px" }}
        value={selectedSection} onChange={handleSectionChange}>
        <option value="" disabled>Select Section</option>
        {allSectionOfClass.map((sec, i) => (
          <option key={i} value={sec}>{sec}</option>
        ))}
      </select><br/>
      <input type = "text" placeholder='Find Student By Roll No..'className='InputFilter'
      value = {inputStd} onChange = {handlefindStd} style={{marginLeft:"41%"}}  />

      {/* Students Table */}
      <div className="tableContainer">
        <table className="table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Roll No</th>
              <th>Gender  </th>
              <th>Contact</th>
              <th>Class</th>
              <th>Admission Date</th>
              <th>Attendance %</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
  {(inputStd ? filteredStd : allStudentsByClass).map((value, index) => {
    const studentPercent = attendanceReport.find(
      item => item.rollNo === value.rollNo
    )?.percentage ?? "N/A";

    return (
      <tr key={index}>
        <td>{value.fullName}</td>
        <td>{value.rollNo}</td>
        <td>{value.gender}</td>
        <td>0{value.parentcontact}</td>
        <td>{value.class}</td>
        <td>{new Date(value.admissionDate).toLocaleDateString('en-GB')}</td>
        <td>{studentPercent}%</td>
        <td>
          <button id="edit-btn" onClick={() => editData(value._id)}>Edit</button>
          <button id="delete-btn" onClick={() => deleteData(value._id,value.rollNo)}>Delete</button>
        </td>
      </tr>
    );
  })}
</tbody>

        </table>
      </div>
    </>
  );
}

export default Students;
