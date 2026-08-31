import React from 'react'
import './Login.css'
import {Link,useNavigate} from 'react-router-dom'
import { useState,useEffect} from 'react'
import axios from 'axios'
import { API_URL } from "../config";

function Login() {

  const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [message,setMessage] = useState('')
     const navigate = useNavigate()

     useEffect(() => {
    document.body.style.background = "linear-gradient(to right, #4E54C8, #8F94FB)";
    
    // Clean up when unmounting
    return () => {
      document.body.style.background = "";
    };
  }, []);
  
const handleSubmit = (e) => {
  e.preventDefault()

  if(!email.trim() || !password.trim()){
    setMessage("Please enter both email and password")
    return
  }

  axios.post(`${API_URL}/register/`,{email,password})
  .then(result => {
 
       console.log(result.data);

    if(result.data.token){
      localStorage.setItem("token",result.data.token)
      localStorage.setItem("refreshToken",result.data.refreshToken)
    }

    if(result.data.message === "Password is incorrect"){
      setMessage("Password is incorrect");
      setPassword("")
    }
    if(result.data.message === "Success"){
      setMessage("✅ Login Successfully!")
      setTimeout(() => {
        navigate("/dashboard")

      },1000)
    }

     if(result.data.message === "No user found"){
      setMessage("No user found")
      setEmail('');
      setPassword('');
    }
  })
  .catch(err => {
    console.log(err);
    setMessage("Login Failed!")
    setEmail("")
    setPassword("")
  })
}

const handleForgotPassword = () => {
     if(!email){
      setMessage("Please enter email to forgot password")
     }else{
        axios.post(`${API_URL}/register/verifyEmail`,{email})
        .then((result) => {
                if(result.data.message === "Email found" ){
                  setMessage("✅ Email Verified")
                  setTimeout(() => {
                    navigate(`/forgotPassword/${email}`)
                  },1500)
                }
        })
        .catch((err) => {
          if(err.response?.data?.message === "Email doesn't exist"){
            setMessage("Email doesn't exist!")
            setEmail("")
          }
        })
     }
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
     <div className='whole-div'>

     <form onSubmit = {handleSubmit}>
  <div className="loginDiv">
    <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h1>

    <div className="input-group">
      <input type="text" id="email" value={email} placeholder="Email..."
        onChange={(e) => setEmail(e.target.value)}  className="input-fields"
      />
    </div>

    <div className="input-group">
      <input type="password" id="password" value={password} placeholder="Password..."
        onChange={(e) => setPassword(e.target.value)} className="input-fields"
      />
    </div>
    <span style={{ color: "white", display: "block", textAlign: "right", marginRight: "10px",marginTop:"-25px",
      cursor:"pointer" }} onClick = {handleForgotPassword} > Forgot Password</span>

    <div style={{ textAlign: "center" }}>
      <button type="submit" className="loginBtn">Login</button>
    </div>

    <p style={{ textAlign: "center", color: "#fff" }}>
      Don't have an account?{" "}
      <Link to="/SignUp" style={{ textDecoration: "underline", color: "rgba(21, 17, 252, 1)" }}>Sign Up
      </Link>
    </p>
  </div>
</form>
</div>

    </>
  )
}

export default Login
