import React, { useState, useEffect, useRef } from 'react'
import "../components/css/FeaturedProducts.css"
import VanillaTilt from 'vanilla-tilt';
import axios from 'axios';

const FeaturedProducts = (props) => {
  const { shoes_names } = props
  
  const products_detail_page=()=>{
     
    props.set_load_overlay_active(true)
    props.set_productdetail_page(true)

    
    
    setTimeout(()=>{
      props.set_load_overlay_active(false)
    },1000)}  

  const [shoes_data, set_shoes_data] = useState([]);
  const tiltRefs = useRef([]);
  


  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const headers = {
          Authorization: `Bearer ${props.token}`,
        };

        const response = await axios.get(props.shoes_api, { headers });
       
        console.log(response)
        set_shoes_data(response.data)
        
       
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [props.hitflag,props.refresh_checkout]);
  const initializeTilt = (element) => {
    const options = {
      max: 45,
      speed: 400,
      glare: true,
      'max-glare': 0.5
    };
    VanillaTilt.init(element, options);
  };
 
  useEffect(() => {
    tiltRefs.current = tiltRefs.current.slice(0, shoes_data.length);

    shoes_data.forEach((_, index) => {
      const tiltRef = tiltRefs.current[index];
      if (tiltRef && tiltRef.current) {
        initializeTilt(tiltRef.current);
      }
    });
   
    return () => {
      tiltRefs.current.forEach((tiltRef) => {
        if (tiltRef && tiltRef.current) {
          VanillaTilt.init(tiltRef.current);
        }
      });
    };
  }, [shoes_data]);
  
 


  return (
    <div className='featured_main_page' id="featured_section" >
      <div className="outer_featured_container">
     <div className="featured_heading_container">
      <div className="heading_best_selling"><span className='best_selling'>{props.heading1}</span>
      <h4 className='featured_heading'>{props.heading2} </h4></div>
      
      <button className='all_products' onClick={()=>{
        
      }}>All Products</button>
      
      
     </div>
      
      <div className="featured_container">
      { shoes_data.map((element,index)=>{
        tiltRefs.current[index] = tiltRefs.current[index] || React.createRef();
        const tiltRef = tiltRefs.current[index];
        return(
        <div key={index}  ref={tiltRef}  className="product_card_container">

         

        

          <div   className="product_card" onClick={()=>{props.get_particular_shoes(element.id,element.shoes_category)}}>
          
            <h4 className='price_tag'>{element.price}$</h4>

            <i className="fa-solid fa-heart heart"></i>
            <img className="card_image" src={element.product_image}></img>
            <div className="card_content">

              <h3>{element.name}</h3>
              
              <h4>{element.shoes_category} Running Shoes</h4>
              <h5 className="featured_stock_heading"style={{color:element.shoes_stock!==0?"green":"red"}}>{element.shoes_stock!==0?"In Stock":"Out Of Stock"}</h5>
              <div className="stars_container">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </div>
              

            </div>
            
            <div className="circle"></div>

          </div>
          <div className="card_button_container">
              <button onClick={()=>{props.add_to_cart(element.id,element.name,9,1)}} className='card_button1'>Add To Cart <span><i class="fa-solid fa-cart-shopping"></i></span></button>
         
            </div>




        </div>)})}
        
      </div>
      
      </div>
    </div>
  )
}

export default FeaturedProducts
