import React from 'react'
import './SignUp.css'
import {Link,useNavigate} from 'react-router-dom'
import axios from 'axios'
import { useState,useEffect } from 'react'
import { API_URL } from "../config";

function SignUp() {
 const [name,setName] = useState('')
 const [email,setEmail] = useState('')
 const [password,setPassword] = useState('')
 const [confirmPassword,setconfirmPassword] = useState('')
 const [message,setMessage] = useState('')
 
 const navigate = useNavigate()
   useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

 useEffect(() => {
  document.body.style.background = "linear-gradient(to right, #4E54C8, #8F94FB)";
     
     // Clean up when unmounting
  return () => {
    document.body.style.background = "";
     };
   }, []);
   

 const handleSubmit = (e) => {
  e.preventDefault();

 
  if (!name || !email || !password || !confirmPassword) {
    setMessage("All fields are required");
    return;
  }


  if (password !== confirmPassword) {
    setMessage("Password must be same to confirmPassword");
    setPassword('');
    setconfirmPassword('');
    return;
  }


axios.post(`${API_URL}/register/signUp`, { name,email,password })
  .then(result => {
    console.log(result);
    setMessage("✅ SignUp successfully!");
    setTimeout(() => {
      navigate("/");
    },1500)
  })
  .catch(err => {
    console.log(err);
    setMessage("SignUp failed!");
    setName("");
    setEmail("");
    setPassword("");
    setconfirmPassword("");
  });
};


  return (
    <>
     {message && (
       <div className="message-box"  style={{ color: message.startsWith("✅") ? "#4CAF50" : "red" }} >
        {message}
       </div>
     )}
      <div className='whole-div'>
     <form onSubmit={handleSubmit}>
  <div className="signupDiv">
    <h1 className="form-heading">SignUp</h1>

    <div className="input-group">
      <input type="text" id="name" value={name} placeholder="Name"
        onChange={(e) => setName(e.target.value)} className="inputField" />
    </div>

    <div className="input-group">
      <input type="email" id="email" value={email} placeholder="Email"
        onChange={(e) => setEmail(e.target.value)} className="inputField" />
    </div>

    <div className="input-group">
      <input  type="password" id="password"  value={password} placeholder="Password"
        onChange={(e) => setPassword(e.target.value)} className="inputField" />
    </div>

    <div className="input-group">
      <input type="password" id="confirmPassword" value={confirmPassword} placeholder="Confirm password"
        onChange={(e) => setconfirmPassword(e.target.value)} className="inputField"/>
    </div>

    <div className="form-action">
      <button type="submit" className="form-button">SignUp</button>
    </div>

    <p className="form-footer">
      Already have an account?
      <Link to="/" className="form-link"> Login</Link>
    </p>
  </div>
</form>
</div>
    </>
  )
}

export default SignUp
