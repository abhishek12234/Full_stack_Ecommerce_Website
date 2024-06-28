import axios from 'axios';
import React, { useState, useEffect } from 'react';


import "../components/css/UserLogin.css"
const UserLogin = (props) => {
  const [user_password, set_user_password] = useState("")
  const [user_email, set_user_email] = useState("")
  const [loginresponse, setLoginresponse] = useState("")
  const [error, errormessage] = useState("")
  const [signup, set_signup] = useState(false)
  const [user_signup_email, set_user_signup_email] = useState("")
  const [create_password, set_create_password] = useState("")
  const [confirm_password, set_confirm_password] = useState("")
  const [signup_error_message,set_error_message]=useState("")
  const [login_error_message,set_login_error_message]=useState("")
  const [showalert,set_show_alert]=useState(false)
  const [user_name,set_user_name]=useState("")
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const back_to_login=()=>{
    set_signup(false)
    set_user_signup_email("")
    set_create_password("")
    set_confirm_password("")
    set_error_message("")
    set_user_name("")

  }
  const signupcheck = async()=>{
    if (user_name===""){
      set_error_message("* Enter Name *")
    }
    else if (user_signup_email===""){
      set_error_message("* Enter Email *")
    }else if (create_password==="" || confirm_password===""){
      set_error_message("* Enter Password *")

    }
    else if (create_password!==confirm_password ){
      set_error_message("* Password not match *")
     
      
    }else{
     

      const signup_data = {
        user_name:user_name,
        email: user_signup_email,
        password: create_password
      };
      
      try {
        props.set_active_loader(true)
        const response = await axios.post('https://shoes-website-fastapi.onrender.com/users', signup_data );
        props.set_active_loader(false)
        set_user_signup_email("")
    set_create_password("")
    set_confirm_password("")
    set_error_message("")
    set_user_name("")
        
  
        

        
        
        
        props.set_show_alert(true)
        props.set_alert_message("Sign Up Sucessful")
        setTimeout(() => {
   
         props.set_show_alert(false)
       },2000);
      } catch (error) {
        console.error('Error making POST request:', error);
      }

     
    }


    
  }
  const Logincheck = async () => {
    
    if (user_email===""){
      set_login_error_message("* Enter Email *")
      
    }else if (! emailPattern.test(user_email)){
      set_login_error_message("* Incorrect email format *")
    }
    else if (user_password===""){
      set_login_error_message("* Enter Password *")
    }else{

    const postData = {
      email: user_email,
      password: user_password
    };
    
    try {
      props.set_active_loader(true)
      const response = await axios.post('https://shoes-website-fastapi.onrender.com/login_user', postData);
      props.set_active_loader(false)
      if (!response.data.status) {
        
        set_login_error_message("* invalid creadintials *")
      } else {
        localStorage.setItem("user_token", JSON.stringify(response.data.token))
        props.settoken(JSON.parse(localStorage.getItem("user_token")))
      }

      setLoginresponse(response.data.status);
      
    } catch (error) {
      console.error('Error making POST request:', error);
    }
  }


  }



  return (
    <div className="login_section">
      
      
      <img className="logo_image_login" src="/nike.png"></img>
      
     
      <div className="image_container">
        <div className="image_heading">
          <h3 className="enamela">BORN TO <span>FLY</span></h3>
          <h4>NIKE</h4>
        </div>

        <img className="image_login" src="/about_shoes.png"></img>
      </div>

      <div className="login_card">
        <div className={`login_container ${signup === false ? "" : "login_container_rotate"}`}>

          <div className='login-front'>
            <h2 className="login_heading enamela">User <span>Login</span></h2>
            <div className='login_input_container'>
              <div className='input_login1'>

                <input type="text" required="required" value={user_email} onChange={(e) => set_user_email(e.target.value)} />
                <span className='input_label'>Email</span>
              </div>
              <div className='input_login2'>

                <input type="password" required="required" value={user_password} onChange={(e) => set_user_password(e.target.value)} />
                <span className='input_label'>Password</span>
              </div>
            </div>
           
            <label >{login_error_message}</label>
            <div className='login_button_container'>
              <button className="login-button enamela" onClick={Logincheck}><b>Login</b></button>
              <button className="login-button enamela" onClick={() => { set_signup(true);set_user_email("");set_user_password("");set_login_error_message("") }}><b>Sign Up</b></button>
            </div>
          </div>

          <div className="login-back">
            <h2 className="enamela">User <span>SignUp</span></h2>
            <div className='signup_input_container'>
            <div className='input_login'>

<input type="text" required="required" value={user_name} onChange={(e) => set_user_name(e.target.value)} />
<span className='input_label'>Name</span>
</div>
              <div className='input_login1'>

                <input type="text" required="required" value={user_signup_email} onChange={(e) => set_user_signup_email(e.target.value)} />
                <span className='input_label'>Email</span>
              </div>
              <div className='input_login2'>

                <input type="password" required="required" value={create_password} onChange={(e) => set_create_password(e.target.value)} />
                <span className='input_label'>Set Password</span>
              </div>
              <div className='input_login3'>

                <input type="password" required="required" value={confirm_password} onChange={(e) => set_confirm_password(e.target.value)} />
                <span className='input_label'>Confirm Password</span>
              </div>
            </div>
            <label className='signup_error_message'>{signup_error_message}</label>
            <div className='signup_button_container'>
              <button className="login-button" onClick={signupcheck}>Create</button>
              <button className="login-button" onClick={back_to_login }>Back</button>
            </div>
          </div>


        </div>
      </div>
    </div>

  )
}

export default UserLogin
