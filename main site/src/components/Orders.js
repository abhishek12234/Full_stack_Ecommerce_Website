import React, { useState, useEffect, useMemo } from 'react'
import "../components/css/Orders.css"
import Dropdown from './Dropdown'
import axios from 'axios';
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel } from "@tanstack/react-table";
import Select from 'react-select';
const { Country, State, City } = require('country-state-city');

// Get all states in India

const Orders = (props) => {
  const [selected, setSelected] = useState("Standard Shipping")
  const [selected1, setSelected1] = useState(["fa-solid fa-money-bill", "Cash On Delivery"])
  const [selected_country, setSelected_country] = useState("Select Country")
  const [selected_state, setSelected_state] = useState("Select State")
  const [selected_city, setSelected_city] = useState("Select City")
  const [selected_street, setSelected_street] = useState("")
  const [delivery_cost, set_delivery_cost] = useState(10)
  const [active_edit_address, set_active_edit_address] = useState(false)
  const [active_place_order, set_active_place_order] = useState(false)
  const [size_drop, set_size_drop] = useState(false)
  const [active_order_summary, set_active_order_summary] = useState(false)
  const options = [["Standard Shipping", "7-8 days"], ["Expedited Shipping", "2-3 days"], ["Express Shipping", "Same day"]];
  const options1 = [["Cash On Delivery", "fa-solid fa-money-bill"], ["Credit Card", "fa-solid fa-credit-card"], ["UPI Payment", "fa-brands fa-paypal"]];
  const [item_name, set_item_name] = useState("")
  const [selectedFile, setSelectedFile] = useState(null);
  const [size_drop_index, set_size_drop_index] = useState(0);
  const [active_order_sucess,set_active_order_sucess]=useState(false)
  const screenWidth = window.innerWidth; // Get the width of the screen
  const shoppingCartWidth = 0.75 * screenWidth; // 75% of the screen width
  const orderSummaryWidth = 0.25 * screenWidth;


  const country_options = Country.getAllCountries().map(country => country.name)
  
  const indiaStates = selected_country !== "Select Country" ? State.getStatesOfCountry(Country.getAllCountries().find(country => country.name === selected_country).isoCode) : [];

  const states_options = indiaStates.map(state => (
    state.name)
  );

  const cities = selected_state !== "Select State" ? City.getCitiesOfState(Country.getAllCountries().find(country => country.name === selected_country).isoCode, State.getAllStates().find(state => state.name === selected_state).isoCode) : [];

  const city_options = cities.map(city => city.name);

  
  useEffect(() => {
    if (selected === "Standard Shipping") {
      set_delivery_cost(10)
    } else if (selected === "Expedited Shipping") {
      set_delivery_cost(15)
    } else if (selected === "Express Shipping") {
      set_delivery_cost(20)
    }

  }, [selected])
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);


  };
  const change_size = async (item_name, item_size) => {
    try {
      set_size_drop(0)
      const headers = {
        Authorization: `Bearer ${props.token}`,
      };
      const item_data = {
        product_name: item_name,
        size: item_size

      }
      
      
      props.set_cart_items((prevData) => {
        return prevData.map((element) => {
          return element.product_name === item_name ? { ...element, size: item_size } : element;
        });
      });

      const response = await axios.put(`https://shoes-website-fastapi.onrender.com/set_item_size`, item_data, { headers });





    } catch (error) {
      console.error('Error fetching data:', error);
    }

  }
  const decrease_item = async (item_name, quantity) => {
    try {
      if (quantity - 1 === 0) {
        try {
         
          const headers = {
            Authorization: `Bearer ${props.token}`,

          };
          props.set_cart_items(props.cart_items.filter((element) => element.product_name !== item_name))
          props.set_shoes_name(props.shoes_names.filter((element) => element !== item_name))
       
          const response = await axios.get(`https://shoes-website-fastapi.onrender.com/delete_cart_item/${item_name}`, { headers });
         
        




        } catch (error) {
          console.error('Error fetching data:', error);
        }

      } else {
        
        const headers = {
          Authorization: `Bearer ${props.token}`,
        };
        const item_data = {
          product_name: item_name

        }
        props.set_cart_items((prevData) => {
          return prevData.map((element) => {
            return element.product_name === item_name ? { ...element, product_quantity: quantity - 1 } : element;
          });
        });

       
        const response = await axios.put(`https://shoes-website-fastapi.onrender.com/decrease_cart_item`, item_data, { headers });
        
      



      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  const delete_cart_item = async (item_name) => {
    try {
      
      const headers = {
        Authorization: `Bearer ${props.token}`,
      };
      props.set_cart_items(props.cart_items.filter((element) => element.product_name !== item_name))
      props.set_shoes_name(props.shoes_names.filter((element) => element !== item_name))
      
      const response = await axios.get(`https://shoes-website-fastapi.onrender.com/delete_cart_item/${item_name}`, { headers });
      
      




    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  const increase_item = async (item_name, quantity) => {
    try {
     
      const headers = {
        Authorization: `Bearer ${props.token}`,
      };
      const item_data = {
        product_name: item_name

      }
      props.set_active_loader(true)
      const response = await axios.put(`https://shoes-website-fastapi.onrender.com/increase_cart_item`, item_data, { headers });
      props.set_active_loader(false)
      if (response.data.status=="ok"){
      props.set_cart_items((prevData) => {
        return prevData.map((element) => {
          
          return element.product_name === item_name ? { ...element, product_quantity: quantity + 1 } : element;
        });
      });
    }else{
      props.set_show_alert(true)
         props.set_alert_message("Cannot Add more")
        setTimeout(() => {
    
          props.set_show_alert(false)
        },2000);
    }




    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const full_address = (country, city, state, street) => {
    props.set_user_adress(`${street}, ${city}, ${state}, ${country}`)
  }
  const add_address = (country, city, state, street) => {

    try {
      const headers = {
        Authorization: `Bearer ${props.token}`

      }
      const address_data = {
        user_address: `${street}, ${city}, ${state}, ${country}`
      }
      props.set_active_loader(true)
      const response = axios.post("https://shoes-website-fastapi.onrender.com/add_address", address_data, { headers })
      props.set_active_loader(false)
      props.set_user_adress(`${street}, ${city}, ${state}, ${country}`)
      set_active_edit_address(false)

    } catch {

    }
  }


  useEffect(() => {
    const fetchcartData = async () => {
      try {

        const headers = {
          Authorization: `Bearer ${props.token}`,
        };
        const response = await axios.get('https://shoes-website-fastapi.onrender.com/all_cart_items', { headers });
        ;

        props.set_cart_items(response.data);
        const names = response.data.map(item => item.product_name)

        props.set_shoes_name(names)



      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchcartData();
  }, []);


  const cart_data = useMemo(() => props.cart_items, [props.cart_items]);
  const cart_columns = [
    {
      header: "Product",
      cell: ({ row }) => (
        <div className='product_cart_container'>
          <div className="cart_image_container">
            <img className="product_image" src={`${row.original.product_image}`} />
          </div>




        </div>
      ), // Make sure the accessor matches the key in your data objects

    },
    {
      header: "Name",
      accessorKey: "product_name"
    },

    {
      header: "Size",
      cell: ({ row }) => {
        return (<div className='size_box'>

          <div className="size_content">
            <div className={`size_dropdown ${size_drop === row.id ? "open_size_dropdown" : ""}`}>
              <span onClick={() => change_size(row.original.product_name, 10)}>10</span>
              <span onClick={() => change_size(row.original.product_name, 11)}>11</span>
              <span onClick={() => change_size(row.original.product_name, 12)}>12</span>
              <span onClick={() => change_size(row.original.product_name, 13)}>13</span>
              <span onClick={() => change_size(row.original.product_name, 14)}>14</span>
              <span onClick={() => change_size(row.original.product_name, 15)}>15</span>
              <span onClick={() => change_size(row.original.product_name, 16)}>16</span>

            </div>
            <span>{row.original.size}</span><div className="choose_size" onClick={() => size_drop !== 0 ? set_size_drop(0) : set_size_drop(row.id)}><i class="fa-solid fa-angle-down"></i></div>
          </div>

        </div>)
      }, // Make sure the accessor matches the key in your data objects

    },
    {
      header: "Quantity",
      cell: ({ row }) => {
        return (<div className='quantity_box'>
          <div className="decrease" onClick={() => decrease_item(row.original.product_name, row.original.product_quantity)}><i class="fa-solid fa-minus"></i></div>
          <span>{row.original.product_quantity}</span>
          <div className="increase" onClick={() => increase_item(row.original.product_name, row.original.product_quantity)}><i class="fa-solid fa-plus"></i></div>
        </div>)
      }

    },
    {
      header: "Price",
      accessorKey: "price",

    }, {
      header: "Total",
      cell: ({ row }) => { return <div>{row.original.price * row.original.product_quantity}</div> }

    }
  ]
  const cart_table = useReactTable({ data: cart_data, columns: cart_columns, getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel() });

  const total = cart_data.reduce((sum, data) => {
    return sum + data.product_quantity * data.price;
  }, 0);

  const active_load_overlay_conatiner = () => {
    
    props.set_load_overlay_active(true)
    props.set_active_cart_page_show("")
    props.set_fitem_active(0)


    setTimeout(() => {
      props.set_load_overlay_active(false)
      set_active_order_sucess(false)
    }, 1000)
    
  }
  const open_order_summary_box = () => {
    set_active_order_summary(false)
  }
  const active_product_container = () => {
    props.set_load_overlay_active(true)
    props.set_active_page_show("all_products")


    setTimeout(() => {
      props.set_load_overlay_active(false)
    }, 1000)
  }

  const checkout_all_items = async (address,selected,selected1) => {
    console.log(props.cart_items)
    if (props.cart_items.length!==0 && address!=="none"){
      

  

    try {
      const headers = {
        Authorization: `Bearer ${props.token}`

      }
      console.log(address,selected,selected1)
      const checkout_data = {
        user_address: address,
        payment: selected1[1],
        shipping_method: selected

      }
      props.set_active_loader(true)
      const response = await axios.post("https://shoes-website-fastapi.onrender.com/add_order", checkout_data, { headers })
      set_active_place_order(false)
      props.set_active_loader(false)
      set_active_order_sucess(true)
      props.set_refresh_checkout(!props.refresh_checkout)
      props.set_cart_items([])
      props.set_shoes_name([])
     
    } catch {
      console.log("error")

    }
  }else{
    props.set_show_alert(true)
    if (props.cart_items.length===0){
      
      props.set_alert_message("Cart Is Empty")
    }else if (address==="none"){
      props.set_alert_message("Add Address")
    }
      setTimeout(() => {
  
        props.set_show_alert(false)
      },2000);
  }

  }

  const checkout_function=()=>{
    if(props.cart_items.length!==0){
    set_active_place_order(true)
  }else{
    props.set_show_alert(true)
      
      props.set_alert_message("Cart Is Empty")
      setTimeout(() => {
  
        props.set_show_alert(false)
      },2000);
  }}
  return (
    <div className={`orders_page ${props.active_cart_page_show === "cart" ? "open_orders_page" : ""} `} >


      <div className={`shopping_cart`}>
        <button onClick={() => { set_active_order_summary(true) }} className="order_summary_button" >ORDER SUMMARY</button>
        <div className="main_heading_container"><i onClick={active_load_overlay_conatiner} className="fa-solid fa-arrow-left cart_back"></i><h3>Shopping <span>Cart</span></h3></div>


        <div className="shopping_content">
          <div className="heading_box">
            <h4 className='shopping_content_heading'><span>Shopping</span> Cart</h4>
            <h3>{props.cart_items.length} Items</h3>

          </div>
          <div className={`no_item_in_cart ${cart_data.length === 0 ? "active_no_item_in_cart" : ""}`}>

            <i class="fa-solid fa-cart-shopping"></i>
            <h4>NO ITEM IN CART</h4>

            <span onClick={active_product_container}>Add Item</span>
          </div>

          <div className="table_order_container">

            <table className={`Cart_table ${cart_data.length === 0 ? "deactive_cart_table" : ""}`}>
              <thead className='order_table_heading'>
                {cart_table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} >
                    {headerGroup.headers.map(header => (
                      <th key={header.id} className='table_head_user'>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>



              <tbody>
                {cart_table.getRowModel().rows.map(row => (

                  <tr key={row.id} className='cell_data'>

                    {row.getVisibleCells().map(cell => (


                      <td key={cell.id} >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}


                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="cart_mobile_product_container">
            {cart_data.map((element, index) => {
              return (
                <div key={index} className="mobile_shoes_container">
                  <i className="fa-solid fa-trash delete_cart_button" onClick={() => { delete_cart_item(element.product_name) }}></i>

                  <div className="mobile_shoes_image_container">
                    <div className='product_cart_container'>
                      <div className="cart_image_container">
                        <img className="product_image" src={`${element.product_image}`} />
                      </div>




                    </div>

                  </div>
                  <div className="mobile_shoes_content_container">
                    <h4 className='mobile_shoes_name'>{element.product_name}</h4>
                    <h5 className='mobile_shoes_type'>{element.shoes_category} Running Shoes</h5>
                    <h4 className='mobile_shoes_price'>${element.price}</h4>

                    <div className="mobile_shoes_bottom_container">

                      <div className="mobile_shoes_size_container">
                        <h4 className='mobile_shoes_size'>Size:</h4>
                        <div className='size_box'>
                          <div className="size_content">
                            <div className={`size_dropdown ${size_drop_index === index & size_drop === true ? "open_size_dropdown" : ""}`}>
                              <span onClick={() => change_size(element.product_name, 10)}>10</span>
                              <span onClick={() => change_size(element.product_name, 11)}>11</span>
                              <span onClick={() => change_size(element.product_name, 12)}>12</span>
                              <span onClick={() => change_size(element.product_name, 13)}>13</span>
                              <span onClick={() => change_size(element.product_name, 14)}>14</span>
                              <span onClick={() => change_size(element.product_name, 15)}>15</span>
                              <span onClick={() => change_size(element.product_name, 16)}>16</span>
                            </div>
                            <span className='size_selector'>{element.size}</span><div className="choose_size" onClick={() => { set_size_drop(!size_drop); set_size_drop_index(index) }}><i class="fa-solid fa-angle-down"></i></div>
                          </div>

                        </div>
                      </div>

                      <div className='quantity_box'>
                        <div className="decrease" onClick={() => decrease_item(element.product_name, element.product_quantity)}><i class="fa-solid fa-minus"></i></div>
                        <span>{element.product_quantity}</span>
                        <div className="increase" onClick={() => increase_item(element.product_name, element.product_quantity)}><i class="fa-solid fa-plus"></i></div>
                      </div>

                    </div>

                  </div>


                </div>
              )
            })
            }
          </div>




        </div>

      </div>

      <div className={`order_summary ${active_order_summary === true ? "open_summary_box" : ""}`}>
        <div className="summary_content">
          <i onClick={open_order_summary_box} className="fa-solid fa-xmark close_order_summary"></i>
          <div className="summary_box">

            <h4><span>Order</span> Summary</h4>

          </div>

          <div className="shipping">
            <h4 className='ship_title'>SHIPPING</h4>
            <Dropdown options={options} selected={selected} setSelected={setSelected} drop_type={"shipping"}></Dropdown>

          </div>
          <div className="payment_mode">
            <h4 className='mode_title'>PAYMENT</h4>
            <Dropdown options={options1} selected={selected1} setSelected={setSelected1} drop_type={"payment"}></Dropdown>

          </div>
          <div className="promocode">
            <h4>PROMO CODE</h4>
            <div className="promo_code_container">
              <input type="text" placeholder='Enter Promo Code' />
              <button className="Promo_button" >APPLY</button>
            </div>

          </div>
          <div className="address_container">
            <div className="address_heading_container">
              <h4>ADDRESS</h4>
              <span onClick={() => { set_active_edit_address(true) }}>{props.user_address === "" ? "Add" : "Edit"}</span>

            </div>
            <div className="address_content_container">
              {props.user_address === "none" ? <h4>NO ADDRESS</h4> :
                <p>{props.user_address}</p>
              }
            </div>
          </div>


          <div className="checkout">
            <div className="checkout_content_container">
              <div className="price">
                <h4>Subtotal</h4>
                <h3>${total}</h3>
              </div>
              <div className="delivery_cost">
                <h4>Delivery</h4>
                <h3>${cart_data.length === 0 ? "0" : delivery_cost}</h3>
              </div>
              <div className="total_cost">
                <h4>Total</h4>
                <h3>${cart_data.length === 0 ? "0" : delivery_cost + total}</h3>
              </div>
            </div>
            <button className="checkout_button" onClick={checkout_function}>CHECKOUT</button>
          </div>


        </div>
      </div>

      <div className={`edit_address_outer_container ${active_edit_address === true ? "active_edit_address_container" : ""}`}>
        <div className={`edit_address_container`}>
          <i className="fa-solid fa-xmark close_edit_address" onClick={() => { set_active_edit_address(false) }}></i>
          <h4 className='edit_address_main_heading'><span>Edit</span> Address</h4>

          
          <span className='edit_save_button' onClick={() => { add_address(selected_country, selected_city, selected_state, selected_street) }}>Save Changes</span>
        </div>
      </div>





      <div className={`place_order ${active_place_order === true ? "active_place_order" : ""}`}>
        <div className="place_order_outer_box">
        <i className="fa-solid fa-xmark close_edit_address" onClick={()=>{set_active_place_order(false)}}></i>
          <h2 className='place_order_heading'>Order <span>Summary</span></h2>
          <div className='place_order_content_container'>
          <label className='place_order_shipping_method'>
              <span>Shipping:</span>
              <h3>{selected}</h3>
            </label>

            <label className='place_order_payment_method'>
              <span>Payment:</span>
              <h3>{selected1[1]}</h3>
            </label>

            <label className='place_order_address'>
              <span>Address:</span>
              <h3>{props.user_address}</h3>
            </label>

            <div className="place_order_listing_summary">
              <div className="place_order_product_name_contianer">
                {cart_data.map((item, index) => {
                  return (
                    <div key={index} className='place_order_product_name_container'>
                    <div className='place_order_product_name'>
                      <h4>{item.product_name} x {item.product_quantity}</h4>
                      <h4>${item.product_quantity * item.price}</h4>
                    </div>
                    <span>size: {item.size}</span>
                    </div>
                  )
                })}

              </div>
              <div className="place_order_subtotal">
                <h4>Subtotal</h4>
                <h4>${total}</h4>
              </div>
              <div className="place_order_delivery">
                <h4>delivery</h4>
                <h4>{selected === "Standard Shipping" ? "$10" :
                  selected === "Expedited Shipping" ? "$15" :
                    selected === "Express Shipping" ? "$20" : ""}</h4>
              </div>

              <div className="place_order_total_bill">
                <h4>Total</h4>
                <h4>${delivery_cost + total}</h4>
              </div>

            </div>
          </div>
          <div className="place_order_button_container">
            <span className='place_order_button' onClick={()=>{checkout_all_items(props.user_address,selected,selected1)}}>Place Order</span>
            
          </div>
        </div>

      </div>


      <div className={`order_placed_sucessfull ${active_order_sucess===true?"active_order_placed_sucessfull":""}`}>
      <i className="fa-solid fa-check"></i>
      <div className='order_placed_sucessfull_button_container'>
      <span className='place_order_button' onClick={active_load_overlay_conatiner}>HOME</span>
      <span className='place_order_button' onClick={()=>{checkout_all_items(props.user_address,selected,selected1)}}>SHOP</span>
      </div>
      </div>


    </div>
  )
}

export default Orders
