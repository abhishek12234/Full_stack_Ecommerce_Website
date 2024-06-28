import React from 'react'
import "../components/css/Contact.css"
const Contact = () => {
  return (
    <section className='contact_outer_container' id="contact_section">
          
      <div className="contact_inner_container">
        
        <div className="contact_design_container">
            <div className="contact_design">
            <img src="/contact_image.jpeg" className="contact_image" alt="" />
            </div>
            

        </div>
     
        
        <div className="contact_content_container">
          
            <div className="heading_container">
            <div className="contact_main_heading">Contact <span>Us</span></div>
            <p>We would love to hear from you</p>
            </div>
            <div className="contact_input_container">
                <input type="text" placeholder="Enter Your Name" className='contact_name' />
                <input type="text"  placeholder="Enter Your Email" className='contact_email' />
                <textarea type="text" placeholder='Enter Your Message' className='contact_message'></textarea>
            </div>
            <button className='contact_submit_button'>Submit</button>
           
        </div>
        

       
      </div>
      <div className="contact_other_info">
        <div className="contact_location_container">
        <i className="fa-solid fa-location-dot location_contact_icon"></i>
        <div className="contact_location_container_content">
          <h5>Office Location</h5>
          <p>karnadia road,indore, Madhya Pradesh</p>
        </div>
        </div>
        <div className="contact_phone_container">
        <i className="fa-solid fa-phone phone_contact_icon"></i>
       
        <div className="contact_phone_container_content">
          <h5>Phone (Landline)</h5>
          <p>+91 6897543567</p>
        </div>
        
        </div>
        <div className="contact_phone_container">
        <i className="fa-solid fa-envelope mail_contact_icon"></i>
       
        <div className="contact_email_container_content">
          <h5>E-Mail</h5>
          <p>shop.fi@gmail.com</p>
        </div>
        
        </div>

      </div>
    </section>
  )
}

export default Contact
