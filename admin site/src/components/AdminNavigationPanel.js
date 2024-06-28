import "../components/css/AdminNavigationPanel.css"

import React, { useState, useEffect, useMemo } from 'react';
const AdminNavigationPanel = (props) => {

 
  return (

    <div className='panel_box'>
        <h1 className='admin_heading enamela'>ADMIN <span>PANE</span></h1>
        <div className="navigation_buttons">
          
        <button onClick={()=>{props.set_panel(0)}} className={`panel_button ${props.current_panel===0?"active_panel":""}`}>Products</button>
        <button onClick={()=>{props.set_panel(1)}} className={`panel_button ${props.current_panel===1?"active_panel":""}`}>Users</button>
        <button onClick={()=>{props.set_panel(2)}} className={`panel_button ${props.current_panel===2?"active_panel":""}`}>dilivery</button>
       
        </div>
      
    </div>
  )
}

export default AdminNavigationPanel
