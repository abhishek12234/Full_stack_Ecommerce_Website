import React from 'react'
import { useState, useEffect,useRef} from 'react'
import axios from 'axios'
import "../components/css/Cart.css"
import _debounce from 'lodash/debounce'
import { Link, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll';

const Cart = (props) => {
  const [item,setitem]=useState(0)
  const [heartbeat, setHeartbeat] = useState('');
  const websocketRef = useRef(null);
  sessionStorage.setItem("active","true")
  const handleW2Message = _debounce((event) => {
    
      
      
   

    props.set_hitflag((prevcount)=>prevcount===false?true:false)
   
    
}, 1000);
  

  useEffect(() => {
    console.log('===================');
    console.log('Token:', props.token);
  
   
      const ws = new WebSocket(`wss://shoes-website-fastapi.onrender.com/ws1`);
  
      ws.onopen = () => {
        console.log('WebSocket connection opened');
        ws.send(props.token);
      };
  
      ws.onmessage = (event) => {
        console.log('WebSocket message received:', event.data);
        handleW2Message(event)
        // Trigger your admin page function here
      };
  
      return () => {
        console.log('WebSocket connection closed');
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      };
  }, []);
  const active_all_products_page=()=>{
     
    props.set_load_overlay_active(true)
    props.set_active_page_show("all_products")
    
    
    
    setTimeout(()=>{
      props.set_load_overlay_active(false)
    },1000)} 

return (
  <>
    
    <div className={`home_page`} id="home_section">
      <div className="home_design">
      <div className="background_design"></div>
      </div>
    <div className="home_container">
      

      <div className="content_container">
        <div className="home_content">
        
          <h4>NIKE <span>SHOES</span></h4>
          <h3>START YOUR DAY WITH <span>PERFECT</span> MOVE</h3>
          
          <p>hello this is website all about img elements must have an alt prop, 
            either with meaningful text, or an empty string for decorative
            </p>
            <div className="home_button_container">
            <Link onClick={active_all_products_page}className="home_button"><b>Buy Now</b></Link>
            <Link to="featured_section" smooth={true} duration={800} className="home_button2"><b>New Collection</b></Link>
            

            </div>
            <div className="home_icon_container">
            <i class="fa-brands fa-twitter"></i>
            <i class="fa-brands fa-facebook-f"></i>
            <i class="fa-brands fa-instagram"></i>
            <i class="fa-brands fa-youtube"></i>
            </div>
            
        </div>
      <div className="home_image_container">
      <img className="home_image" src="/about_shoes.png"></img> 
      </div> 
      </div> 

      </div>
      

    </div>
   
    
    </>
  )
}

export default Cart
