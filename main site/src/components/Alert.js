import React from 'react'
import "../components/css/Alert.css"
const Alert = (props) => {
    
  return (
    
      <div className={`alert_container ${props.showalert===false?"close_alert":""}`}>
      <div className="alert alert-success alert-white rounded">
    
    <div className="icon"></div>
    <i className="fa fa-check success_icon"></i>
    <strong>Success!</strong> {props.alert_message}
      </div>
      <button  className="close"></button>
      </div>
    
  )
}

export default Alert
