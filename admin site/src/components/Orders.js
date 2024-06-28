import React from 'react'
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import "../components/css/Orders.css"
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel } from "@tanstack/react-table";
import Dropdown from './Dropdown';

const Orders = (props) => {
    const [search_order,set_search_order]=useState("")
    const [orders,set_orders]=useState([])
    const [active_status,set_active_status]=useState(1)
    const [close_status,set_close_status]=useState(0)
    const [status_id,set_status_id]=useState("")
    const [status_date,set_status_date]=useState("")
    const [status_name,set_status_name]=useState("")
    const [current_order_status,set_current_order_status]=useState("")
    const [update_row,set_update_row]=useState(0)
    const [order_status,set_order_status]=useState("")

    console.log(current_order_status,"-------------------")
    

    const update_status_database=async(id,status_data)=>{
      

        try {
          const updated_data = {
            
            order_status: status_data
          }
          const headers = {
            Authorization: `Bearer ${props.token}`,
          };
          const response = await axios.put(`https://shoes-website-fastapi.onrender.com/update_status/${id}`, updated_data, { headers });
          console.log(response)
          set_orders((prevData) => {
            return prevData.map((element) => {
              return element.order_id === id ? { ...element,order_status: status_data} : element;
            });
          });
          
    
         
         
          set_update_row(0)
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      
    }
   
    useEffect(() => {
        const fetchData = async () => {
          try {
            const headers = {
              Authorization: `Bearer ${props.token}`,
            };
            props.set_table_loader(true)
            const response = await axios.get('https://shoes-website-fastapi.onrender.com/all_order', { headers });
            ;
            props.set_table_loader(false)
            set_orders(response.data);
            
            console.log(response);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, []);
      

      const order_data = useMemo(() => orders.filter((element) => {
        return search_order.toLowerCase() == "" ? element : element.product_name.toLowerCase().includes(search_order);
      }), [orders,search_order]);
      const handleOrderDelete = async (id) => {
        try {
          const headers = {
            Authorization: `Bearer ${props.token}`,
          };
          const response = await axios.get(`https://shoes-website-fastapi.onrender.com/delete_order/${id}`, { headers });
    
          console.log("before",orders)
          set_orders(orders.filter((element) => element.order_id !== id))
          console.log("after",orders)
    
    
    
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    
      }
      
      const order_columns = useMemo(()=>[
        {
          header: "Product",
          cell: ({ row }) => {
            
            return <img className="product_image" src={row.original.product_image}/>
          }
        },
        {
          header: "Order ID",
          accessorKey: 'order_id', // Make sure the accessor matches the key in your data objects
         
        },
        {
          header: "User Name",
          accessorKey: 'owner_name'
        },
        {
            header: "User ID",
            accessorKey: 'owner_id', // Make sure the accessor matches the key in your data objects
            
          },
          {
            header: "Product",
            accessorKey: 'product_name', // Make sure the accessor matches the key in your data objects
            
          },
          {
            header: "Price",
            accessorKey: 'price',
            cell: ({ row }) => (
               <span>{row.original.price}</span>
            )            
          },
          {
            header: "Status",
            accessorKey: 'order_status',
            cell: ({ row }) => {
              if (row.original.order_id === update_row) {
                return (
                  <div className="drop_down_outermost_container">
                    <Dropdown width={"130px"} options={["order placed","processing" ,"shipped", "delivered"]} selected={order_status} setSelected={set_order_status} />
                  </div>
                );
              } else {
                return (
                  <div className='order_status_container'>
                    <i className="fa-solid fa-circle" style={{color:row.original.order_status==="delivered"?"green":""}}></i>
                    <h4>{row.original.order_status}</h4>
                  </div>
                );
              }
            }
          }
          ,
          {
            header: "Payment",
            accessorKey: 'payment', // Make sure the accessor matches the key in your data objects
            cell: ({ row }) => (

                <div className='payment_mode_container'><h4>{row.original.payment}</h4></div>
              )
          },{
            header: "Date",
            accessorKey: 'ordered_at',
            cell: ({ row }) => {
              // Parse the original date string into a Date object
              const parsedDate = new Date(row.original.ordered_at);
              console.log("innnn")
              if (isNaN(parsedDate.getTime())) {
                console.error("Invalid date:", row.original.ordered_at);
                return <span>Invalid date</span>;
              }
      
              // Format the date as a string in your desired format
              const formattedDate = `${parsedDate.getDate().toString().padStart(2, '0')}/${(parsedDate.getMonth() + 1).toString().padStart(2, '0')}/${parsedDate.getFullYear()}`;
      
              return (<span>{formattedDate}</span>);
            } // Make sure the accessor matches the key in your data objects
            
          },
          {
            
            header: "Action",
            cell: ({ row }) => (
              row.original.order_id === update_row ? (
                <div className='update_action_container'>
                  <i className="fa-solid fa-check correct_update" onClick={()=>{ update_status_database(row.original.order_id,order_status)}}></i>
                  <i className="fa-solid fa-xmark wrong_update" onClick={() => set_update_row(0)}></i>
                </div>
              ) : (
                <div className='action_container'>
                  <i className="fa-solid fa-trash-can delete_icon" onClick={() => handleOrderDelete(row.original.id)}></i>
                  <i className="fa-solid fa-pen-to-square update_icon" onClick={()=>{set_update_row(row.original.order_id);set_order_status(row.original.order_status)}}></i>
                </div>
              )
            )
      
          }
      ],[orders,order_status,update_row]);
      const order_table = useReactTable({ data: order_data, columns: order_columns, getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel() });

      

    return (
        <div className='outer_order_container'>
            <div className={`outer_order_status ${close_status===0?"":"active_outer_order_status"}`}>
            <div className='order_status'>
            <i onClick={()=>{set_close_status(0)}} class="fa-solid fa-circle-xmark"></i>
              <h2 className='order_status_heading enamela'>Order <span>Status</span></h2>
              <div className="order_details_container">
              <div className="order_details_element">
                  <h4>Order ID</h4>
                  <h5>{status_id}</h5>
                </div>

               

                <div className="order_details_element">
                  <h4>Shoes</h4>
                  <h5>{status_name}</h5>
                </div>

                <div className="order_details_element">
                  <h4>Date</h4>
                  <h5>{status_date}</h5>
                </div>

                
              </div>
              <div className="status">
                <h4>Status</h4>
                <div className="status_outer_container">
                <div className={`status_container ${active_status==1?"active_status":""}`} onClick={()=>{set_active_status(1);set_current_order_status("Processing")}}>Processing</div>
                <div className={`status_container ${active_status==2?"active_status":""}`} onClick={()=>{set_active_status(2);set_current_order_status("Shipped")}}>Shipped</div>
                <div className={`status_container ${active_status==3?"active_status":""}`} onClick={()=>{set_active_status(3);set_current_order_status("Out For Delivery")}}>Out For Delivery</div>
                <div className={`status_container ${active_status==4?"active_status":""}`} onClick={()=>{set_active_status(4);set_current_order_status("Delivered")}}>Delivered</div>
                </div>
              </div>
              <button className='update_status_button' onClick={()=>{update_status_database(status_id,current_order_status)}}>submit</button>
            </div>
            </div>


            <h2 className='order_heading enamela'>ORDER <span>DETAILS</span></h2>
            <div className="order_search_container">
                <i className="fa-solid fa-magnifying-glass search_icon"></i>
                <input value={search_order} onChange={(e) => set_search_order(e.target.value)} type="text" className="search_order" />

            </div>
            <div className="w3-container">
              
          <div className={`loader_inner_container1 ${props.table_loader === false ? "loader_inner_container_deactive" : ""}`}>
            <span className="loader"></span>
            <h3 className='loader_heading'>Loading...</h3>
          </div>

            <table class="w3-table-all">
          <thead >
            {order_table.getHeaderGroups().map(headerGroup => (
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
            {order_table.getRowModel().rows.map(row => (

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


        </div>
    )

}

export default Orders
