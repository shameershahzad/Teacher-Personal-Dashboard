import React, { useEffect, useState } from 'react'
import "./ForgotPassword.css"
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import "./ForgotPassword.css"
import { API_URL } from "../config";

function ForgotPassword() {
    const [updatePassword,setupdatePassword] = useState('')
    const [message,setMessage] = useState('')
    const nav = useNavigate()
    const {email} = useParams()

    useEffect(() => {
        if(message){
            const timeout = setTimeout(() => setMessage(''),3000)
            return () => clearTimeout(timeout)
        }
    },[message])

    const handleUpdatePass = () => {
        if(!updatePassword.trim()){
            setMessage("❌ Password cannot be empty")
            return
        }
        axios.put(`${API_URL}/register/updatePassword/${email}`,{newPassword:updatePassword})
        .then(result => {
            console.log(result.data.message)
            if(result){
                setMessage("✅ Password updated!")
                setTimeout(() => {
                   nav("/")
                },1000)
            }
        })
        .catch(err => console.log("Error:",err))
    }
  return (
    <>
     {message && (
       <div className="message-box"  style={{ color: message.startsWith("✅") ? "#4CAF50" : "red" }} >
        {message}
       </div>
     )}
     <div className='whole-div'>
    <div className='forgotPassDiv'>
     <h1 className='Form-Title'>Forgot Password</h1>
     <input type = "password" value = {updatePassword} className='Input-Field' placeholder='Forgot Password...'
     onChange={(e) => setupdatePassword(e.target.value)} /> 
       <button className='updateBtn' onClick={handleUpdatePass}>Update Password</button>
    </div>
     </div>
    </>
  )
}

export default ForgotPassword
