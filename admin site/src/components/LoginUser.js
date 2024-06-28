import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import "../components/css/LoginUser.css"

const LoginUser = (props) => {
  const [password, setpassword] = useState("")
  const [email, setemail] = useState("")
  const [loginresponse, setLoginresponse] = useState("")
  const [error, errormessage] = useState("")
  const Logincheck = async () => {
    const postData = {
      email: email,
      password: password
    };
    console.log(postData)
    try {
      const response = await axios.post('https://shoes-website-fastapi.onrender.com/login_admin', postData);
      
      if (!response.data.status) {
        console.log("invalid")
        errormessage("invalid creadintials")
      } else {
        localStorage.setItem("admin_token", JSON.stringify(response.data.token))
        props.settoken(JSON.parse(localStorage.getItem("admin_token")))
      }

      setLoginresponse(response.data.status);
      console.log('Post request successful:', !response.data.status);
    } catch (error) {
      console.error('Error making POST request:', error);
    }


  }
  return (
    <div className='login-container'>
      <h2>Login Page</h2>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setemail(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setpassword(e.target.value)} />
      </div>
      <div>
        <button className="login-button" onClick={Logincheck}>Login</button>
        <button className="login-button">Register New User</button>
      </div>
    </div>
  )
}

export default LoginUser
