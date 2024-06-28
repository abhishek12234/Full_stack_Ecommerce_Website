import {React,useEffect,useState} from 'react'
import "../components/css/Navbar.css"
import { Link, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll';
import axios from 'axios'
const Navbar = (props) => {
  

  
  const active_cart=()=>{
    props.set_load_overlay_active(true)
    props.set_active_cart_page_show("cart")
    
    
    setTimeout(()=>{
      props.set_load_overlay_active(false)
    },1000)}

    const active_about_page=()=>{
     
      props.set_load_overlay_active(true)
      props.set_active_about_page_show("about")
      props.set_fitem_active(1)
      
      
      setTimeout(()=>{
        props.set_load_overlay_active(false)
      },1000)}  

      const active_checkout_page=()=>{
     
        props.set_load_overlay_active(true)
        props.set_active_orders_page_show("checkout")
        props.set_fitem_active(4)
        
        
        setTimeout(()=>{
          props.set_load_overlay_active(false)
        },1000)}  

      const active_all_products_page=()=>{
     
        props.set_load_overlay_active(true)
        props.set_active_all_product_page_show("all_products")
        props.set_fitem_active(3)
        
        
        setTimeout(()=>{
          props.set_load_overlay_active(false)
        },1000)}  
    const logout = async() => {
    
    
        try {
          const headers = {
            Authorization: `Bearer ${props.token}`,
          };
          props.set_active_loader(true)
          const response =await axios.get('https://shoes-website-fastapi.onrender.com/logout_user',{headers});
          props.set_active_loader(false)
        
     
        } catch (error) {
          console.error('Error making POST request:', error);
        }
        localStorage.setItem("user_token", JSON.stringify(""))
        props.settoken(JSON.parse(localStorage.getItem("user_token")))
      }
  useEffect(()=>{
    if (props.activeSection==="home_section"){
       props.set_fitem_active(0)
    }if (props.activeSection==="contact_section"){
      props.set_fitem_active(2)
   }
  },[props.activeSection])
  
     
  return (
    <div className={`nave_bar`}  style={{backgroundColor:props.nave_background===true?"#1d1d1d":""}}>
      <div className="nav_logo_box">
      <img className="logo_image" src="/nike.png"></img>
      
      </div>  
      <div className="nav_items">
        <Link to="home_section" smooth={true} duration={800} onClick={()=>{props.set_fitem_active(0)}} className={`fitem`}>Home<span className={`fitem_new ${props.fitem_active==0?"active_fitem":""}`}></span></Link>
        <Link onClick={active_about_page} className={`fitem `}>About<span className={`fitem_new ${props.fitem_active==1?"active_fitem":""}`}></span></Link>
        <Link to="contact_section" smooth={true} duration={800} onClick={()=>{props.set_fitem_active(2)}} className={`fitem`}>Contact<span className={`fitem_new ${props.fitem_active==2?"active_fitem":""}`}></span></Link>
        <Link onClick={active_all_products_page} className={`fitem `}>Shopping<span className={`fitem_new ${props.fitem_active==3?"active_fitem":""}`}></span></Link>
        <Link onClick={active_checkout_page} className={`fitem `}>Orders<span className={`fitem_new ${props.fitem_active==4?"active_fitem":""}`}></span></Link>
      </div>

      <div className="profile_container">
      <div className="profile_button" style={{border:props.nave_background===true?"2px solid #bf2028":""}} onClick={()=>props.set_profile(props.profile===false?true:false)}>
      <i class="fa-solid fa-user"></i>
      </div>   
      <div className="menu_mobile_button">
      <i class="fa-solid fa-bars" style={props.nave_background===true?{color:"#f0f0f0"}:null} onClick={()=>{ props.set_open_mobile_menu(true)}}></i>
      </div>
     
      
      <div className="cart_item_content">
        <div className="item_count">{props.cart_items.length}</div>
      <i onClick={active_cart} style={{color:props.nave_background===true?"#f3f3f3":""}} className="fa-solid fa-cart-shopping cart-item"></i>
      </div>
      <div className="logout_button" style={props.nave_background===true?{backgroundColor:"#bf2028",outline:"none"}:null} onClick={logout}>
          <h1 style={{color:props.nave_background===true?"#161616":""}}>Log Out</h1>
          
          </div>

          
      </div>
      
    </div>
  )
}

export default Navbar
