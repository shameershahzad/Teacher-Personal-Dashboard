import { API_URL } from "../config";
  import React, { useEffect, useState } from "react";
  import axios from "axios";
  import { useNavigate } from "react-router-dom";
  import "./Classes.css"

  const Classes = () => {
    const [allClasses, setallClasses] = useState([]);
    const [filterClass,setFilterClass] = useState([])
    const [inputClass,setinputClass] = useState('')
    const [message,setMessage] = useState('')

    const nav = useNavigate()
  
    useEffect(() => {
      const token = localStorage.getItem("token");
      if(!token){
        setMessage("Login again");
        setTimeout(() => {
          nav("/")
        },1500)
      }
        axios.get(`${API_URL}/class/showClasses`,{headers:{Authorization:`Bearer ${token}`}})
        .then((result) => {
           if(result.data.message === "Classes found!"){
            console.log(result.data);
            setallClasses(result.data.result)
           }
        })
        .catch((err) => {
          console.log("Error:",err);
          setMessage("Error fetching data");
        })
      
    },[nav])

   const editData = (id) => {
  const foundID = allClasses.find(classes => classes._id === id)
  if(foundID){
    nav(`/editClass/${id}`)
  }
  else{
    setMessage("Class id is not found")
  }
}

const deleteData = (id) => {
  const token = localStorage.getItem("token");
 

  axios.delete(`${API_URL}/class/deleteClass/${id}`, {
    headers: {
      Authorization: `Bearer ${token}` 
    }
  })
  .then(() => {
    setMessage("✅ Class Deleted");
    setallClasses(prev => prev.filter(item => item._id !== id));
  })
  .catch(err => {
    console.log(err);
    setMessage("Class not deleted.");
  });
};

useEffect(() => {
  if(message){
      const timeout = setTimeout(() => setMessage(''), 3000);
    return () => clearTimeout(timeout);
  }
},[message])

const handleFilterClass = (e) => {
 const inpt  = e.target.value
 setinputClass(inpt)


 const classFilter = allClasses.filter(item => item.class === Number(inpt)) 
 setFilterClass(classFilter)
}

return (
    <>
    {message && (
      <div className="message-popup" style={{ color: message.startsWith("✅") ? "#4CAF50" : "red" }} >
        {message}
      </div>
    )}

    <input type="tel" value= {inputClass} onChange={handleFilterClass} className="Input-Filter" placeholder="Find Class" />
    <div className="table-container">
    <table className="table">
      <thead>
        <tr>
        <th>Class</th>
        <th>Section</th>
        <th>Subject</th>
        <th>Total Students</th>
        <th>Actions</th>
        </tr>
      </thead>
      <tbody>
         {(inputClass? filterClass:allClasses).map((value,index) => (

          <tr key = {index}>
          <td>{value.class}</td>
          <td>{value.section}</td>
          <td>{value.subject}</td>
          <td>{value.countStd}</td>
         <td>
             <button id="edit-btn" onClick={() => editData(value._id)}>Edit</button>
             <button id="delete-btn" onClick={() => deleteData(value._id)}>Delete</button>
         </td>


          </tr>
          
         ))}
      </tbody>
    </table>
      </div>

    </>

    );
  };

  export default Classes;
