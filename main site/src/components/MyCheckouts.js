import React, { useState, useEffect,useRef } from 'react'
import "../components/css/MyCheckouts.css"
import axios from 'axios'
import VanillaTilt from 'vanilla-tilt'
const MyCheckouts = (props) => {
  const [open_checkout_dropdown, set_checkout_dropdown] = useState(false)
  const [open_checkout_dropdown_index, set_checkout_dropdown_index] = useState(null)
  const [checkout_status, set_checkout_status] = useState("order shipped")
  const [checkout_data, set_checkout_data] = useState([])
  const [current_exculsive_card,set_current_exclusive_card]=useState(2)
  const tiltRefs = useRef([]);
  const exclusive_collection=[{
    name:"Nike Force",
    id:15,
    price:112,
    product_image:"/about_shoes.png",
    shoes_category:"Mens",


  },{
    name:"Nike Force",
    id:15,
    price:140,
    product_image:"/about_shoes.png",
    shoes_category:"Mens",
    

  },{
    name:"Nike Force",
    id:15,
    price:112,
    product_image:"/about2_image.png",
    shoes_category:"Unisex",
    

  }

]
  const dropdown_toggle = (index) => {
    set_checkout_dropdown(!open_checkout_dropdown)
    set_checkout_dropdown_index(index)
  }
  function formatDate(data) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
    // Parse the input date string
    const parts = data.ordered_at.split(/[-T:\s\.+]/);
    const date = new Date(Date.UTC(parts[0], parts[1]-1, parts[2], parts[3], parts[4], parts[5]));
  
    if (data.shipping_method==="Standard Shipping"){
      date.setDate(date.getDate() + 7)
    }else if (data.shipping_method==="Expedited Shipping"){
      date.setDate(date.getDate() + 5)
    }else if (data.shipping_method==="Express Shipping"){
      date.setDate(date.getDate() + 1)
    }
    // Extract day, month, and day of the week
    const day = date.getDate();
    const month = months[date.getMonth()];
    const dayOfWeek = days[date.getDay()];
  
    // Return the formatted date
    return `${day} ${month}, ${dayOfWeek}`;
  }
  
  // Example usage:
  

  useEffect(() => {
    const fetchData = async () => {
      try {

        const headers = {
          Authorization: `Bearer ${props.token}`,
        };


        const response = await axios.get("https://shoes-website-fastapi.onrender.com/current_user_all_order", { headers });

        console.log(response)
        set_checkout_data(response.data)


      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [props.hitflag,props.refresh_checkout]);
  

  const deactive_checkout_page=()=>{
        
    props.set_load_overlay_active(true)
    props.set_active_orders_page_show("")
    props.set_fitem_active(0)
    
    
    setTimeout(()=>{
      props.set_load_overlay_active(false)
    },1000)} 

    const initializeTilt = (element) => {
      const options = {
        max: 20,
        speed: 400,
        glare: true,
        'max-glare': 0.5
      };
      VanillaTilt.init(element, options);
    };

    useEffect(() => {
      tiltRefs.current = tiltRefs.current.slice(0, exclusive_collection.length);
    
      exclusive_collection.forEach((_, index) => {
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
    }, [current_exculsive_card]);

    useEffect(() => {
      const intervalId = setInterval(() => {
        // Call your function here
        if(current_exculsive_card<2){
          set_current_exclusive_card(current_exculsive_card+1)}
          else{set_current_exclusive_card(0)}
      }, 2500); // Interval in milliseconds
     
      // Clean up function to clear the interval when component unmounts
      return () => clearInterval(intervalId);
    });
  return (
    <div className={`my_checkouts_page ${props.active_orders_page_show === "checkout" ? "open_checkout_page" : ""}`}>
      <div className="mobile_checkout_heading_container">

<h4 className='mobile_checkout_main_heading'>My <span>Orders</span></h4>

</div>
      <div className='my_checkouts_page_inner_container'>
        <div className="checkout_exclusive_collection">
           <div className="checkout_exclusive_collection_layer">
            <div className="exclusive_collection_heading_container">
              <h5><span>Exclusive</span> Collection</h5>

            </div>

            <div className="card_exclusive_outer_most">
            <i className="fa-solid fa-angle-left exclusive_left" onClick={()=>{current_exculsive_card>0?set_current_exclusive_card(current_exculsive_card-1):set_current_exclusive_card(2)}} ></i>

           <div className="exclusive_card_outer_container">
            {exclusive_collection.map((element, index) => {
              const tiltRef = tiltRefs.current[index] || React.createRef();
              tiltRefs.current[index] = tiltRef;
              
              
              return (
                <div key={index} ref={tiltRef} className={`exclusive_card_container ${current_exculsive_card===index?"active_exclusive_card_container":""}`}>





                  <div className="exclusive_card" >

                    <h4 className='exclusive_price_tag'>{element.price}$</h4>

                    <i className="fa-solid fa-heart exclusive_heart"></i>
                    <img className="exclusive_card_image" src={element.product_image}></img>
                    <div className="exclusive_card_content">

                      <h3>{element.name}</h3>

                      <h4>{element.shoes_category} Running Shoes</h4>
                      <div className="exclusive_stars_container">
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                      </div>

                    </div>
                    <div className="exclusive_card_button_container">
                      <button onClick={()=>props.add_to_cart(element.id,element.name)} className='exclusive_card_button1'>Add To Cart <span><i class="fa-solid fa-cart-shopping"></i></span></button>

                    </div>
                    <div className="exclusive_circle"></div>

                  </div>




                </div>)
            })}
            </div>
            <i className="fa-solid fa-angle-right exclusive_right" onClick={()=>{current_exculsive_card<2?set_current_exclusive_card(current_exculsive_card+1):set_current_exclusive_card(0)}}></i>
            </div>

            <div className="exclusive_collection_main_content">
              <h3 className='exclusive_collection_main_content_heading'>Exclusive <span>Collection</span></h3>

              <p>Experience luxury redefined with our exclusive shoes. Crafted with precision and adorned with premium materials, 
                each pair is a statement of sophistication. Elevate your style and step into exclusivity.</p>
                <span className='exclusive_shop_now_button'>SHOP NOW</span>
            </div>
           
            

           </div>
        </div>


      <div className="outer_checkout_container">
        <i onClick={deactive_checkout_page}className="fa-solid fa-arrow-left checkout_back"></i>
        <div className="checkout_heading_container">

          <h4 className='checkout_main_heading'>My <span>Orders</span></h4>
          <h4 className='mobile_checkout_total_checkouts'>items: <span>{checkout_data.length}</span></h4>
          <span className='sort_by_button'>Sort By</span>
        </div>
        <div className="main_checkout_content_conatiner">


          {checkout_data.map((checkout_products, index) => {


            return (<div className="checkout_product" key={index}>

              <div className='checkout_product_card_container'>
                <div className='product_cart_container'>
                  <div className="cart_image_container">
                    <img className="product_image" src={checkout_products.product_image} />
                  </div>
                </div>
                <div className="checkout_main_content_container">
                  <h4 className='order_id'>Order ID #123ebcd{checkout_products.order_id}</h4>
                  <div className="delivery_date_box">

                    <div className='show_order_status1'><i class="fa-solid fa-circle" style={{color:checkout_products.order_status==="delivered"?"green":""}}></i> <h4>{checkout_products.order_status}</h4></div>
                  </div>
                  <div className='checkout_main_content_inner_container'>


                    <h5 className='checkout_shoes_name'>{checkout_products.product_name}</h5>
                    <h4 className='shoes_type_checkout'>{checkout_products.shoes_category} Shoes</h4>
                    <div className="stars_container1">
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                    </div>
                    <h4 className='shoes_price_checkout'>${checkout_products.price}</h4>
                    <h4 className='current_status_delivery'>Deliver by: <span>{formatDate(checkout_products)}</span> </h4>
                    <div className="quantity_size_contiainer">
                      <h5 className='checkout_quantity'>Quantity: <span>{checkout_products.product_quantity}</span></h5>
                      <h5 className='checkout_size'>Size: <span>{checkout_products.size}</span></h5>
                    </div>
                  </div>




                </div>
                <div className={`checkout_drop_down_button`} onClick={() => { dropdown_toggle(index) }}><i className={`fa-solid fa-angle-right ${open_checkout_dropdown_index === index && open_checkout_dropdown === true ? "checkout_drop_down_button_rotate" : ""}`}></i></div>
              </div>

              <div className={`checkout_dropdown_container ${open_checkout_dropdown_index === index && open_checkout_dropdown === true ? "checkout_dropdown_container_open" : ""}`}>
                <div className="my_order_status_container">
                  <div className={`order_status_dot_container ${checkout_products.order_status === "order placed" || checkout_products.order_status === "processing" || checkout_products.order_status === "shipped" || checkout_products.order_status === "delivered" ? "active_status" : ""}`}>
                    <span className={`order_placed`}><i class="fa-solid fa-check"></i></span>
                    <h5>Order Placed</h5>
                  </div>

                  <div className={`order_status_dot_container ${checkout_products.order_status === "processing" || checkout_products.order_status === "shipped" || checkout_products.order_status === "delivered" ? "active_status" : ""}`}>
                    <span className={`order_processing `}><i class="fa-solid fa-gear"></i></span>
                    <h5>Processing</h5>
                  </div>

                  <div className={`order_status_dot_container ${checkout_products.order_status=== "shipped" || checkout_products.order_status === "delivered" ? "active_status" : ""}`}>
                    <span className={`order_shiped`}><i class="fa-solid fa-truck-fast"></i></span>
                    <h5>Shipped</h5>
                  </div>
                  <div className={`order_status_dot_container ${checkout_products.order_status === "delivered" ? "active_status" : ""}`}>
                    <span className={`order_delivered`}><i class="fa-solid fa-check"></i></span>
                    <h5>Delivered</h5>
                  </div>

                </div>

                <div className="chekout_dropdown_main_content_container">
                  <div className="checkout_dropdown_top_container">
                    <label className='checkout_shipping'>
                      <span>Order Date:</span>
                      {(() => {
                        const parsedDate = new Date(checkout_products.ordered_at);
                        const formattedDate = `${parsedDate.getDate().toString().padStart(2, '0')}/${(parsedDate.getMonth() + 1).toString().padStart(2, '0')}/${parsedDate.getFullYear()}`;
                        return <h4>{formattedDate}</h4>;
                      })()}
                    </label>

                    <label className='checkout_shipping'>
                      <span>Shipping:</span>
                      <h4>{checkout_products.shipping_method}</h4>
                    </label>

                    <label className='checkout_payment'>
                      <span>Payment:</span>
                      <h4>{checkout_products.payment}</h4>
                    </label>

                    <label className='checkout_payment'>
                      <span>Address:</span>
                      <h4>{checkout_products.user_address}</h4>
                    </label>
                  </div>

                  <div className="checkout_total_payment">
                    <div className="checkout_product_name">
                      <h4>{checkout_products.product_name} x {checkout_products.product_quantity}</h4>
                      <h4>${checkout_products.price * checkout_products.product_quantity}</h4>
                    </div>
                    <div className="checkout_subtotal">
                      <h4>Subtotal</h4>
                      <h4>${checkout_products.price}</h4>
                    </div>
                    <div className="checkout_delivery">
                      <h4>delivery</h4>
                      <h4>{checkout_products.shipping_method === "Standard Shipping" ? "$10" :
                        checkout_products.shipping_method === "Expedited Shipping" ? "$15" :
                          checkout_products.shipping_method === "Express Shipping" ? "$20" : ""}</h4>
                    </div>

                    <div className="checkout_total_bill">
                      <h4>Total</h4>
                      <h4>${checkout_products.shipping_method === "Standard Shipping" ? 10 + (checkout_products.product_quantity * checkout_products.price) :
                        checkout_products.shipping_method === "Expedited Shipping" ? 15 + (checkout_products.product_quantity * checkout_products.price) :
                          checkout_products.shipping_method === "Express Shipping" ? 20 + (checkout_products.product_quantity * checkout_products.price) : ""}</h4>
                    </div>

                  </div>



                </div>
                <div className="checkout_button_container">
                  <button className="invoice">DOWNLOAD INVOICE</button>
                  <button className="cancel_order">CANCLE ORDER</button>
                </div>
              </div>

            </div>)
          })}

        </div>
      </div>

      </div>

    </div>
  )
}

export default MyCheckouts
