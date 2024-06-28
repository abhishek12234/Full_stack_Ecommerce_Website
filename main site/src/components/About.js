import React from 'react'
import "../components/css/About.css"
const About = (props) => {
    const deactive_about_page=()=>{
        
        props.set_load_overlay_active(true)
        props.set_active_about_page_show("")
        props.set_fitem_active(0)
        
        setTimeout(()=>{
          props.set_load_overlay_active(false)
        },1000)}  
    return (
        <div className={`about_outer_container ${props.active_about_page_show === "about" ? "open_about_page" : ""}`}>
            <i  onClick={deactive_about_page} className="fa-solid fa-arrow-left about_back"></i>
            <h1 className='about_main_heading'><span>About</span> Us</h1>
        <div className="about_main_content_container">
            <div className="about_inner_container">

                <div className="about_shoes_design_container1">
                    <div className="about_design"></div>
                    <div className="about_shoes_container">
                        <img src="/about_shoes.png" className='about_shoes_image' />
                    </div>
                </div>

                <div className="about1_content">
                    <h1 className='about1_heading'> Our <span>Goal</span></h1>
                    <div className="about1_main_para">
                        <p>At [Your E-commerce Website Name], our goal is to become your go-to destination for all your footwear needs. We aim to offer an extensive selection of shoes that cater to every style, occasion, and budget, ensuring that you find exactly what you're looking for.</p>
                        <p>We're dedicated to providing exceptional customer service, seamless shopping experiences, and expert guidance to help you make the perfect choice. Our goal is to exceed your expectations at every step of your journey with us.</p>
                    </div>
                </div>

            </div>

            <div className="about_inner_container2">

                <div className="about_shoes_design_container2">
                    <div className="about_design"></div>
                    <div className="about_shoes_container">
                        <img src="/about2_image.png" className='about2_image' />
                    </div>
                </div>

                <div className="about2_content">
                    <h1 className='about2_heading'>Our <span>Mission</span></h1>
                    <div className="about2_main_para">
                        <p>At [Your E-commerce Website Name], our goal is to become your go-to destination for all your footwear needs. We aim to offer an extensive selection of shoes that cater to every style, occasion, and budget, ensuring that you find exactly what you're looking for.</p>
                        <p>We're dedicated to providing exceptional customer service, seamless shopping experiences, and expert guidance to help you make the perfect choice. Our goal is to exceed your expectations at every step of your journey with us.</p>
                    </div>
                </div>

            </div>
            </div>
        </div>
    )
}

export default About
