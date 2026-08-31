import React,{useState,useEffect} from 'react'
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from "../config";

function EditAttendance() {
  
  const {id} = useParams();
  const nav = useNavigate()
  const [editAttendance,seteditAttendance] = useState({fullName:'',rollNo:'',date:'',status:''})
  const [originalAttendance,setoriginalAttendance] = useState({fullName:'',rollNo:'',date:'',status:''})
  const [message,setMessage] = useState('')

  const token = localStorage.getItem("token");


useEffect(() => {
  axios.get(`${API_URL}/attendance/prevAttendance/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
 .then(res => { 
  console.log(res)
  seteditAttendance({
   fullName: res.data.fullName,
    rollNo:res.data.rollNo,
    status:res.data.status
  });
  setoriginalAttendance({
    fullName: res.data.fullName,
    rollNo:res.data.rollNo,
    status:res.data.status
  });
  console.log("Edit Attendance",editAttendance)
  console.log("Original Attendance",originalAttendance)
})
  .catch(err => {
    console.log(err);
    setMessage("Failed to load student attendance. Try Again!");
    setTimeout(() => {
      nav("/attendance");
    },1500)
  });
}, [token,id,originalAttendance,editAttendance,nav]);

 const editData = (e) => {
   e.preventDefault();
  const token =  localStorage.getItem("token");
  if(editAttendance.status === originalAttendance.status){
    setMessage("Nothing update")
    setTimeout(() => {
      nav("/attendance")
    },1500)
  }
else{
  axios.put(`${API_URL}/attendance/editAttendance/${id}`,editAttendance, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(() => {
    setMessage("✅ Student Attendance updated");
     setTimeout(() => {
      nav("/attendance");
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
        <input type = "text" placeholder="Full Name..." value = {editAttendance.fullName} readOnly/>
        <input type = "text" placeholder="Roll No..." value = {editAttendance.rollNo} readOnly/>
         <select value = {editAttendance.status} className='Drop-down' onChange={(e)=> seteditAttendance({...editAttendance,status:e.target.value})} style={{marginTop:"2px"}} >
            <option value = "" disabled>Select status</option>
            <option value="present">present</option>
            <option value="absent">absent</option>
            <option value="leave">leave</option>

        </select>
        <button className="addBtn" type = "submit">Update</button>
      </form>
    </div>
    </>
  )
}

export default EditAttendance
