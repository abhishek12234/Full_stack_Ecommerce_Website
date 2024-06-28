import React from 'react'
import { useState,useEffect } from 'react';
import AdminProducts from "./components/AdminProducts"
import LoginUser from './components/LoginUser';
import AdminNavigationPanel from './components/AdminNavigationPanel';
import Users from './components/Users';
import Orders from './components/Orders';
import _debounce from 'lodash/debounce';

function App() {
  const [active_loader,set_active_loader]=useState(false)
  const [table_loader,set_table_loader]=useState(false)
  const [token, settoken] = useState(localStorage.getItem('admin_token') !== null ? JSON.parse(localStorage.getItem("admin_token")) : "")
  const [hitflag, set_hitflag] = useState(false)
  const logout = () => {
    localStorage.setItem("admin_token", JSON.stringify(""))
    settoken(JSON.parse(localStorage.getItem("admin_token")))

  }
  
  const [current_panel,set_panel]=useState(0)
  const handleW2Message = _debounce((event) => {



  

    set_hitflag((prevcount) => prevcount === false ? true : false)


  }, 1000);
  useEffect(() => {
    // Replace with your FastAPI WebSocket URL


    var ws2 = new WebSocket("wss://shoes-website-fastapi.onrender.com/ws1")
    // Event handler for the connect event

    ws2.onopen = () => {
      ws2.send(token);

    }
    ws2.onmessage = (event) => {
    
      console.log("text recieved")
      console.log(event.data)
      // Trigger your admin page function here
      handleW2Message(event)




    };


    return () => {
      // Use correct variable name here (ws2 instead of w2)
      if (ws2.readyState === WebSocket.OPEN) {
        ws2.close();
      }
    };



  }, [token]);

  return (
    <>
      <div>
      
        {console.log("token", token)}
        {token === "" ?
          (<LoginUser token={token} settoken={settoken} />)
          :(
          <div className='Admin_page'>
            <div className={`loader_container ${active_loader===true?"show_loader":""}`}>
          <div className="loader_inner_container">
        <span className="loader"></span>
        </div>
      </div>
            
          <AdminNavigationPanel set_panel={set_panel} current_panel={current_panel}/>
          {current_panel===1?<Users  hitflag={hitflag}set_hitflag={set_hitflag} table_loader={table_loader} set_table_loader={set_table_loader} set_active_loader={set_active_loader}token={token} settoken={settoken} set_panel={set_panel} current_panel={current_panel}/>:
           current_panel===0?<AdminProducts hitflag={hitflag}set_hitflag={set_hitflag} table_loader={table_loader} set_table_loader={set_table_loader} set_active_loader={set_active_loader} token={token} settoken={settoken} set_panel={set_panel} current_panel={current_panel}/>:
           current_panel===2?<Orders hitflag={hitflag}set_hitflag={set_hitflag} table_loader={table_loader} set_table_loader={set_table_loader} set_active_loader={set_active_loader} token={token} settoken={settoken}/>:
           ""
          }
          
          
          <div className="logout">
            
          <i class="fa-solid fa-arrow-right-from-bracket log_out_icon" onClick={logout}></i>
          <h1>Log Out</h1>
          </div>
          </div>
          )
        }
      </div>
    </>
  );
}

export default App;
