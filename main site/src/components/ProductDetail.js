import React, { useState, useEffect, useRef } from 'react'; // Ensure proper import of React

import "../components/css/ProductDetail.css"
import VanillaTilt from 'vanilla-tilt';

const ProductDetail = (props) => {
 
  const tiltRefs = useRef([]);
  const increase_shoes_quantity=(stock)=>{
    if (props.productdetail_quantity<stock){
    props.set_productdetail_quantity((prev)=>prev>=1?prev+1:prev)
    }else{
      props.set_show_alert(true)
      props.set_alert_message("Cannot Add more")
     setTimeout(() => {
 
       props.set_show_alert(false)
     },2000);

    }

  }
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
    tiltRefs.current = tiltRefs.current.slice(0, props.particular_shoes_category.length);

    props.particular_shoes_category.forEach((_, index) => {
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
  }, [props.particular_shoes_category]);
  const close_products_detail_page = () => {

    props.set_load_overlay_active(true)
    props.set_productdetail_page(false)



    setTimeout(() => {
      props.set_load_overlay_active(false)
    }, 1000)
  }

  return (
    <div className={`productdetail_page ${props.open_productdetail_page === true ? "open_productdetail_page" : ""}`}>
      <div className="productdetail_background">


      </div>
      <i className="fa-solid fa-xmark close_productdetail_page_button" onClick={close_products_detail_page}></i>
      <div className="productdetail_outer_container">

        <div className="productdetail_photo_container">

          <img src={props.particular_shoes.product_image} alt="" />
        </div>

        <div className="productdetail_content_container">

          <h3 className='productdetail_content_name'>
            <span>{props.particular_shoes && props.particular_shoes.name && props.particular_shoes.name.split(" ")[0]} </span>{props.particular_shoes && props.particular_shoes.name && props.particular_shoes.name.split(" ")[1]}
          </h3>

          <h4 className='productdetail_content_catagori'>{props.particular_shoes.shoes_category} Collection</h4>
          <div className="stars_container2">
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
          </div>
          <h4 className='productdetail_content_price'>${props.particular_shoes.price}</h4>
          <div className="productdetail_size_quantity_container">

            <div className="productdetail_size_container">
              <h3>Size:</h3>
              <div className="size_boxes">
                <span onClick={() => { props.set_active_size(9) }} className={`${props.active_size === 9 ? "product_detail_active_size" : ""}`}>9</span>
                <span onClick={() => { props.set_active_size(10) }} className={`${props.active_size === 10 ? "product_detail_active_size" : ""}`}>10</span>
                <span onClick={() => { props.set_active_size(11) }} className={`${props.active_size === 11 ? "product_detail_active_size" : ""}`}>11</span>
                <span onClick={() => {props.set_active_size(12) }} className={`${props.active_size === 12 ? "product_detail_active_size" : ""}`}>12</span>
              </div>
            </div>

            <div className="productdetail_quantity_box_outer_container">
              <h3>Quantity:</h3>
              <div className='productdetail_quantity_box'>
                <div className="decrease1" onClick={()=>{props.set_productdetail_quantity((prev)=>prev>1?prev-1:prev)}}><i class="fa-solid fa-minus"></i></div>
                <span>{props.productdetail_quantity}</span>
                <div className="increase1" onClick={()=>{increase_shoes_quantity(props.particular_shoes.shoes_stock)}}><i class="fa-solid fa-plus"></i></div>
              </div>
            </div>

           


          </div>
          <h3 className="product_detail_stock_heading"><span style={{color:props.particular_shoes.shoes_stock!==0?"green":"red"}}>{props.particular_shoes.shoes_stock!==0?"In Stock":"Out Of Stock"}</span></h3>
          <div className="productdetail_button_container">
            <button className="productdetail_button1" onClick={()=>{props.add_to_cart(props.particular_shoes.id,props.particular_shoes.name,props.active_size,props.productdetail_quantity)}}><i class="fa-solid fa-bag-shopping"></i> Add To Cart</button>
            <button className="productdetail_button2"><i class="fa-solid fa-heart"></i> Wishlist</button>
          </div>
          <div className="productdetail_discription_container">
            <span>Discription:</span>
            <p>
              {props.particular_shoes.shoes_description}</p>
          </div>

         

            <div className="particular_outer_featured_container">
     <div className="particular_featured_heading_container">
      <div className="heading_best_selling">
      <h4 className='particular_featured_heading'><span style={{color:"#bf2028"}}>SIMILAR</span> PRODUCTS</h4></div>
      
    
      
      
     </div>
      
      <div className="particular_product_featured_container">
      {props.particular_shoes_category.map((element,index)=>{
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





        </div>



      </div>
    
  )
}

export default ProductDetail
