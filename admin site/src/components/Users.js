import React, { useState, useEffect, useMemo } from 'react';
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel } from "@tanstack/react-table";
import io from 'socket.io-client';
import "../components/css/Users.css"
import _debounce from 'lodash/debounce';

import axios from 'axios';
const Users = (props) => {
  const [users, set_users] = useState([])
  const [notifications, setNotifications] = useState([]);
  const [count, set_count] = useState(0)
  const [search_user, set_search_user] = useState("")
  const [track, set_track] = useState("")
 

  const delete_user = async (user_id) => {
    try {
      const headers = {
        Authorization: `Bearer ${props.token}`,
      };
      const response = await axios.get(`https://shoes-website-fastapi.onrender.com/delete_user/${user_id}`, { headers });


      set_users(user_data.filter((element) => element.id !== user_id))



    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  console.log(props.hitflag)
  useEffect(() => {
    const fetchuserData = async () => {
      try {

        const headers = {
          Authorization: `Bearer ${props.token}`,
        };
        props.set_table_loader(true)
        const response = await axios.get('https://shoes-website-fastapi.onrender.com/allusers', { headers });
        props.set_table_loader(false)
        ;
        set_users(response.data);

        console.log(response, "response");
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchuserData();
  }, [props.hitflag]);

  const handleApiHit = () => {
    // Your admin page function logic here

    console.log('API was hit!');







  };

 



  console.log(track, "----------------")
  console.log(count)


  console.log(users)
  const user_data = useMemo(() => users.filter((element) => {
    return search_user.toLowerCase() === "" ? element : element.email.toLowerCase().includes(search_user);
  }), [users, search_user]);

  const users_columns = [
    {
      header: "ID",
      accessorKey: 'id', // Make sure the accessor matches the key in your data objects

    },
    {
      header: "Name",
      accessorKey: 'user_name', // Make sure the accessor matches the key in your data objects

    },
    {
      header: "email",
      accessorKey: 'email', // Make sure the accessor matches the key in your data objects

    },
    {
      header: "Address",
      accessorKey: "user_address",
      cell: ({ row }) => (
        <div className="user_address_container">
          <span>{row.original.user_address==="none"?"None":row.original.user_address}</span>

        </div>
      )

    },
    {
      header: "Phone",
      accessorKey: "user_phone_no",
      cell: ({ row }) => (
        
          <span>{row.original.user_phone_no===""?"None":row.original.user_phone_no}</span>

        
      )

    },
    {
      header: "login status",

      cell: ({ row }) => (

        row.original.login_status === true ? <div className="login_outer"><div className='login_container'>login</div></div> : <div className='logout_outer'><div className='logout_container'>logout</div></div>
      )


    }, {
      header: "Online Status",

      cell: ({ row }) => (

        row.original.online_status === true ? <div className='online_container'><i className="fa-solid fa-circle online"></i></div> : ""
      )


    },
    {
      header: "Created At",
      accessorKey: "created_at",
      cell: ({ row }) => {
        // Parse the original date string into a Date object
        const parsedDate = new Date(row.original.created_at);
        console.log("innnn")


        // Format the date as a string in your desired format
        const formattedDate = `${parsedDate.getDate().toString().padStart(2, '0')}/${(parsedDate.getMonth() + 1).toString().padStart(2, '0')}/${parsedDate.getFullYear()}`;

        return (<span>{formattedDate}</span>);
      }


    },
    {
      header: "Action",
      cell: ({ row }) => (


        <div className='action_container'>
          <i className="fa-solid fa-trash-can delete_icon" onClick={() => delete_user(row.original.id)}></i>


        </div>
      )

    }



  ];
  const user_table = useReactTable({ data: user_data, columns: users_columns, getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel() });

  return (

    <div className={`outer_container ${props.current_panel === 1 ? "active_user" : ""}`}>

      <div className="inner_container">
        <h1 className='user_heading enamela'>USER<span> DASHBOARD</span></h1>

       {/* <div className="user_detail_container">
          <div className="user_detail_1">

            <h1 className='enamela'>  <span><i class="fa-solid fa-users-line user_icon"></i></span> User <span>Details</span></h1>

            <div className="info1">
              <label>Total Purchase</label>
              <span className='ultra'>600000</span>
            </div>

            <div className="info2">
              <label>Items Bought</label>
              <span className='ultra'>600000</span>
            </div>

          </div>
          <div className="user_detail_2">

            <h1 className='enamela'>  <span><i class="fa-solid fa-users-line user_icon"></i></span> Users <span>Status</span></h1>

            <div className="info1">
              <label>Online Users</label>
              <span className='ultra'>600</span>
            </div>

            <div className="info2">
              <label>Offline Users</label>
              <span className='ultra'>600</span>
            </div>
          </div>
  </div>*/}
        <div className="search_container_user">
          <i className="fa-solid fa-magnifying-glass search_icon"></i>
          <input value={search_user} onChange={(e) => set_search_user(e.target.value)} type="text" className="search_user" />

        </div>
        <div className='w3-container'>

          <div className={`loader_inner_container1 ${props.table_loader === false ? "loader_inner_container_deactive" : ""}`}>
            <span className="loader"></span>
            <h3 className='loader_heading'>Loading...</h3>
          </div>

          <table class="w3-table-all">
            <thead >
              {user_table.getHeaderGroups().map(headerGroup => (
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
              {user_table.getRowModel().rows.map(row => (

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
    </div>

  )
}

export default Users
