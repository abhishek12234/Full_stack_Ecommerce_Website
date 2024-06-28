import React, { useState, useEffect } from 'react'
import "../components/css/Profile1.css"
import axios from 'axios'
import Dropdown from './Dropdown'
const { Country, State, City } = require('country-state-city');

const Profile1 = (props) => {
    const [open_new_profile_box, set_new_profile_box] = useState(false)
    const [user_street,user_city,user_state,user_country]=props.user_address.split(", ")
    const [edit_container_open, set_edit_container_open] = useState(0)
    const [edit_profile_user_name, set_edit_profile_user_name] = useState("")
    const [edit_profile_user_phone, set_edit_profile_user_phone] = useState("")
    const [edit_profile_user_address, set_edit_profile_user_address] = useState("")
    const [open_edit_address_container, set_open_edit_address_container] = useState(false)
    const [open_edit_phone_input, set_open_edit_phone_input] = useState(false)
    const [open_edit_name_input, set_open_edit_name_input] = useState(false)
    const [selected_country, setSelected_country] = useState("Select Country")
    const [selected_state, setSelected_state] = useState("Select State")
    const [selected_city, setSelected_city] = useState("Select City")
    const [Selected_street, setSelected_street] = useState("")
    const [country_options,set_country_options]=useState([])
    const [states_options,set_states_options]=useState([])
    const [city_options,set_city_options]=useState([])
    function validateName(name) {
        // Minimum length constraint
        const minLength = 2;
    
        // Maximum length constraint
        const maxLength = 50;
    
        // Remove white spaces from the name
        const trimmedName = name.replace(/\s+/g, '');
    
        // Test if the trimmed name meets the minimum and maximum length requirements
        if (trimmedName.length < minLength || trimmedName.length > maxLength) {
            return false;
        }
    
        // Allowed characters constraint (alphabets and hyphens)
        const allowedCharacters = /^[a-zA-Z-]*$/;
    
        // Test if the trimmed name contains only allowed characters
        if (!allowedCharacters.test(trimmedName)) {
            return false;
        }
    
        // All constraints passed
        return true;
    }

    function isValidPhoneNumber(input) {
        // Regular expression to match 10 digits
        const phoneNumberRegex = /^\d{10}$/;
    
        // Remove all white spaces from the input string
        const cleanedInput = input.replace(/\s/g, '');
    
        // Check if the cleaned input is a number or can be parsed as a number
        const isNumeric = !isNaN(cleanedInput) && isFinite(cleanedInput);
    
        // Check if the cleaned input matches the regular expression for 10-digit number
        const is10DigitNumber = phoneNumberRegex.test(cleanedInput);
    
        // Return true if the cleaned input is a valid number and a 10-digit number
        return isNumeric && is10DigitNumber;
    }
   

    useEffect(() => {
        const fetchData = async () => {
            try {
    
                const headers = {
                    Authorization: `Bearer ${props.token}`,
                };
                const response = await axios.get('https://shoes-website-fastapi.onrender.com/current_user_info', { headers });
                props.set_user_name(response.data.user_name)
                props.set_user_email(response.data.email)
                props.set_user_adress(response.data.user_address)
                props.set_user_phone_number(response.data.user_phone_no)
                console.log(response.data.user_address)
                if(response.data.user_address!=="None"){
                  const [user_street,user_city,user_state,user_country]=response.data.user_address.split(", ")
                  props.setSelected_country(user_country)
                  props.setSelected_state(user_state)
                  props.setSelected_city(user_city)
                  props.setSelected_street(user_street)
    
                }else{
                    props.setSelected_country("Select Country")
                  props.setSelected_state("Select State")
                  props.setSelected_city("Select City")
                  props.setSelected_street("")


                }
    
                
    
    
    
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, [open_edit_name_input,open_edit_phone_input,open_edit_address_container]);
    console.log(props.selected_state,'this is options')
    
   const save_all_address_changes=async (country, city, state, street)=>{
    

        try {
          const headers = {
            Authorization: `Bearer ${props.token}`
    
          }
          const address_data = {
            user_address: `${street}, ${city}, ${state}, ${country}`
          }
          props.set_active_loader(true)
          const response = await axios.post("https://shoes-website-fastapi.onrender.com/add_address", address_data, { headers })
          props.set_active_loader(false)
          set_open_edit_address_container(false); 
          props.set_user_adress(`${street}, ${city}, ${state}, ${country}`)
        } catch {
    
        }
            



   }

   const save_all_name_changes=async (name)=>{
    if (validateName(name)){
    
    try {
      const headers = {
        Authorization: `Bearer ${props.token}`

      }
      const name_data = {
        user_name:(name.trim().split(/\s+/)).join(" ")
      }
      props.set_active_loader(true)
      const response = await axios.post("https://shoes-website-fastapi.onrender.com/add_name", name_data, { headers })
      props.set_active_loader(false)
      set_open_edit_address_container(false); 
      set_open_edit_name_input(false)
      props.set_user_name((name.trim().split(/\s+/)).join(" "))
    } catch {

    }
}else{
    props.set_show_alert(true)
        props.set_alert_message("Invalid Name")
        setTimeout(() => {
   
         props.set_show_alert(false)
       },2000);
}
        



}

const save_all_number_changes=async (number)=>{
    if (isValidPhoneNumber(number)){

    try {
      const headers = {
        Authorization: `Bearer ${props.token}`

      }
      const name_data = {
        user_phone_no:number.replace(/\s+/g, '')
      }
      props.set_active_loader(true)
      const response = await axios.post("https://shoes-website-fastapi.onrender.com/add_number", name_data, { headers })
      props.set_active_loader(false)
      set_open_edit_address_container(false); 
      set_open_edit_phone_input(false)
      props.set_user_phone_number(number.replace(/\s+/g, ''))
    } catch {

    }}
    else{
        props.set_show_alert(true)
        props.set_alert_message("Invalid Number")
        setTimeout(() => {
   
         props.set_show_alert(false)
       },2000);
    }
        



}

useState(()=>{
    if(props.profile){
   
       set_new_profile_box(true)
       console.log("set_trues")
    }else{
        
            
            setTimeout(function() {
                props.set_profile(false)
            }, 1000)
            set_new_profile_box(false)
    
    
        

    }

},[props.profile])

    return (

             <>
             <div className={`disable_background_new_profile ${props.profile===true?"disable_main_webite_content":""}`}></div>
            <div className={`new_profile_outer_container ${props.profile === false ? "close_new_profile_outer_container" : ""}`}>
                <div className={`new_profile_boxes  new_profile_boxe1 ${props.profile === false ? "close_new_profile_boxes" : ""}`}></div>
                <div className={`new_profile_boxes new_profile_boxe2 ${props.profile === false ? "close_new_profile_boxes" : ""}`}></div>
                <div className={`new_profile_boxes new_profile_boxe3 ${props.profile === false ? "close_new_profile_boxes" : ""}`}></div>
                <div className={`new_profile_boxes new_profile_boxe4 ${props.profile === false ? "close_new_profile_boxes" : ""}`}></div>


                <div className={`new_profile_inner_container1 ${props.profile === false ? "close_new_profile_inner_container" : ""}`}>

                    <div className={`new_profile_edit_content_container ${edit_container_open === 1 ? "open_new_profile_edit_content_container" : ""}`}>
                        <h4 className='new_profile_edit_content_heading'><span>Edit</span> Profile</h4>

                        <div className="edit_profile_input_container">


                        <div className="edit_profile_input1">
                                <div className="edit_profile_input_name_heading">
                                    <h3 className="edit_profile_name">Name</h3>
                                    {!open_edit_name_input ? <span onClick={() => { set_open_edit_name_input(true) }} style={{cursor:"pointer"}}>Edit</span> : 
                                    <div className="edit_profile_address_save_close">
                                        <span onClick={() => {set_open_edit_name_input(false) }}>close</span>
                                    <span onClick={() => { save_all_name_changes(edit_profile_user_name) }}>Save</span>
                                    </div>}

                                </div>

                                <div className="edit_profile_input_name_main_content_container">
                                {open_edit_name_input===false?(<h2 >{props.get_user_name !== "" ? props.get_user_name : "NO Name"}</h2>):
                                <input style={{marginTop:"2px",marginBottom:"-3px"}}className="new_profile_edit_name" defaultValue={props.get_user_name} onChange={(e)=>{set_edit_profile_user_name(e.target.value)}}/>}

                                </div>

                            </div>


                         <div className="edit_profile_input2">
                                <div className="edit_profile_input_number_heading">
                                    <h3 className="edit_profile_number">Phone</h3>
                                    {!open_edit_phone_input?<span onClick={() => { set_open_edit_phone_input(true) }}>Edit</span> : 
                                    <div className="edit_profile_address_save_close">
                                         <span onClick={() => {set_open_edit_phone_input(false) }}>close</span>

                                    <span onClick={() => {save_all_number_changes(edit_profile_user_phone) }}>Save</span>
                                    </div>
                                    }

                                </div>

                                <div className="edit_profile_input_number_main_content_container">
                                {open_edit_phone_input===false?(<h2 >{props.get_user_phone_number !== "" ? props.get_user_phone_number : "NO NUMBER"}</h2>):
                                <input style={{marginTop:"2px",marginBottom:"-3px"}} className="new_profile_number" defaultValue={props.get_user_phone_number} onChange={(e)=>{set_edit_profile_user_phone(e.target.value)}}/>}

                                </div>

                            </div>


                            <div className='edit_profile_input3'>

                                <div className="edit_profile_input_address_container">
                                    <h3 className="edit_profile_address">Address</h3>
                                    {!open_edit_address_container ? <span onClick={() => { set_open_edit_address_container(true) }}>Edit</span> : 
                                    <div className="edit_profile_address_save_close">
                                    <span onClick={()=>{set_open_edit_address_container(false)}}>Close</span>
                                    <span onClick={() => { save_all_address_changes(props.selected_country, props.selected_city, props.selected_state, props.Selected_street)}}>Save</span>
                                    </div>
                                    }

                                </div>
                                <div className={`edit_profile_input_address_main_container`}>
                                    {open_edit_address_container===false?(<h2 >{props.user_address !== "none" ? props.user_address : "NO ADDRESS"}</h2>):
                                    (<div className={`edit_profile_input_address_inner_container ${open_edit_address_container === true ? "open_edit_profile_input_address_inner_container" : ""}`}>
                                        <label className='new_profile_input_edit_address_dropdown'>
                                            <span>Country</span>
                                            <Dropdown options={props.country_options} selected={props.selected_country} setSelected={props.setSelected_country} drop_type={"country"}></Dropdown>

                                        </label>

                                        <label className='new_profile_input_edit_address_dropdown'>
                                            <span>State</span>
                                            <Dropdown options={props.states_options} selected={props.selected_state} setSelected={props.setSelected_state} drop_type={"states"}></Dropdown>

                                        </label>
                                        <label className='new_profile_input_edit_address_dropdown'>
                                            <span>City</span>
                                            <Dropdown options={props.city_options} selected={props.selected_city} setSelected={props.setSelected_city} drop_type={"city"}></Dropdown>

                                        </label>

                                        <label className='new_profile_input_edit_address_dropdown'>
                                            <span>Street</span>
                                            <input type="text" className='new_profile_edit_address_street' defaultValue={props.Selected_street} onChange={(e) => { props.setSelected_street(e.target.value) }} />
                                        </label>

                                    </div>)}

                                </div>
                            </div>
                        </div>



                    <div className="new_profile_button_container">
                    
                    <button className="new_profile_button" onClick={() => { set_edit_container_open(0) }} >Back</button>
                    </div>
                        

                    </div>

                    <div className={`new_profile_main_content_container ${edit_container_open === 0 ? "open_new_profile_main_content_container" : ""}`}>
                        <h4 className='new_profile_main_content_heading'><span>My</span> Profile</h4>
                        <div className="new_profile_photo_container">
                            <div className="new_profile_photo">{props.get_user_name===""?"":props.get_user_name[0].toUpperCase()}</div>
                            <div className="new_profile_photo_edit"><i class="fa-solid fa-camera"></i></div>
                        </div>
                        <h3 className='new_profile_name'>{props.get_user_name}</h3>
                        <div className="new_profile_info_outer_container">
                            <label className='new_profile_info_container'>
                                <span><i class="fa-solid fa-envelope"></i></span>
                                <p>{props.get_user_email}</p>
                            </label>
                            <label className='new_profile_info_container'>
                                <span><i class="fa-solid fa-phone"></i></span>
                                <p>{props.get_user_phone_number === "" ? "NO NUMBER" : props.get_user_phone_number}</p>
                            </label>
                            <label className='new_profile_info_container' style={{ alignItems: "flex-start" }}>
                                <span><i class="fa-solid fa-location-dot"></i></span>
                                <p>{props.user_address==="none"?"NO ADDRESS":props.user_address}</p>
                            </label>
                        </div>

                        <div className="new_profile_button_container">
                            <button className="new_profile_button" onClick={() => { set_edit_container_open(1) }} >Edit</button>
                            <button className="new_profile_button" onClick={()=>{props.set_profile(false)}}>Back</button>
                        </div>

                    </div>



                </div>


            </div>
            </>
     
    )
}

export default Profile1
