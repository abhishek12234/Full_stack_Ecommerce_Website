import { useState ,useEffect} from "react";
import "../components/css/Dropdown.css"

function Dropdown({ options,selected, setSelected,width}) {
  const [isActive, setIsActive] = useState(false);
  

  return (
    <div className="dropdown">
      
      <div className="dropdown-btn" style={{width:width}} onClick={(e) => options.length!==0?setIsActive(!isActive):""}>
       <h4>{selected}</h4> <i className="fa fa-caret-down"></i>
          
      </div>
      {isActive && (
        <div className="dropdown-content">
          {options.map((option,index) => (
            <div
              key={index}
              onClick={(e) => {
               
                
                  setSelected(option);
               
                setIsActive(false);
              }}
              className="dropdown-item"
            >
             <h5>{option}</h5>
              
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
