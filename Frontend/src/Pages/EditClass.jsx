import React, { useEffect, useState } from 'react'
import "./AddClass.css"
import { useNavigate,useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from "../config";

function EditClass() {
    const {id} = useParams();
    const nav = useNavigate()
    const [editClass, seteditClass] = useState({ class: '',section: '',subject: '' });
    const [originalClass, setoriginalClass] = useState({ class: '',section: '',subject: '' });
    const [message,setMessage] = useState('')
  
  useEffect(() => {
  const token = localStorage.getItem("token");
  

  axios.get(`${API_URL}/class/prevClass/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
 .then(result => {
  console.log(result)
  if(result.data.message === "Classess found!"){
    seteditClass({
      class: result.data.result.class,
      section: result.data.result.section,
      subject: result.data.result.subject,
    });
    setoriginalClass({
      class: result.data.result.class,
      section: result.data.result.section,
      subject: result.data.result.subject,
    });
  }
})
  
.catch(err => {
  console.log(err);
  setMessage("Failed to load class. Try Again!");
  setTimeout(() => {
    nav("/classes");
  },1500)
});
}, [id,nav]);


  const editData = (e) => {
    e.preventDefault();
  const token = localStorage.getItem("token");
  if(editClass.class === originalClass.class && editClass.section === originalClass.section &&
     editClass.subject === originalClass.subject){
    setMessage("Nothing update")
    setTimeout(() => {
    nav("/classes")
    },1500)
  }
else{

  axios.put(`${API_URL}/class/editClass/${id}`, editClass, {
    headers: {
      Authorization: `Bearer ${token}`
    }

  })
  .then(() => {
    setMessage("✅ Class updated");
    setTimeout(() => {
      nav("/classes");
    },1500)
  })
  .catch(err => {
    console.log(err);
    setMessage("Update failed. Try Again.");
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
       <div className='add-class-card'>
     <h1>Edit Class</h1> 
      <form onSubmit={editData}>
        <input type="text" placeholder='Class...' value={editClass.class} onChange={(e) =>  seteditClass({...editClass,class:e.target.value})} />
        <input type="text" placeholder='Section...' value={editClass.section} onChange={(e) =>  seteditClass({...editClass,section:e.target.value})}/>
        <input type="text" placeholder='Subject...'value={editClass.subject}  onChange={(e) =>  seteditClass({...editClass,subject:e.target.value})}/>
        <button type="submit">Update</button>
      </form>

    </div> 
    </>
  )
}

export default EditClass
