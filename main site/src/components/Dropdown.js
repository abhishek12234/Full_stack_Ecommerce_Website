import { useState } from "react";
import "../components/css/Dropdown.css"

function Dropdown({ options,selected, setSelected,drop_type }) {
  const [isActive, setIsActive] = useState(false);
  if (drop_type==="country"){

  console.log(options,"country")
  }
  console.log(drop_type)
  return (
    <div className="dropdown">
      
      <div className="dropdown-btn" onClick={(e) => options.length!==0?setIsActive(!isActive):""}>
       {drop_type==="shipping"?(<h4>{selected}</h4>):
       drop_type==="payment"?(<div className="payment_drop"><h4>{selected[1]}</h4> <i className={selected[0]}></i></div>):
       drop_type==="states"?(<h4>{selected}</h4>):
       drop_type==="country"?(<h4>{selected}</h4>):
       drop_type==="city"?(<h4>{selected}</h4>): ""} <i className="fa fa-caret-down"></i>
          
      </div>
      {isActive && (
        <div className="dropdown-content">
          {options.map((option,index) => (
            <div
              key={index}
              onClick={(e) => {
                if (drop_type === "shipping") {
                  setSelected(option[0]);
                } else if(drop_type === "payment") {
                  setSelected([option[1], option[0]]);
                }else if(drop_type === "states") {
                  setSelected(option);
                }else if(drop_type === "country") {
                  setSelected(option.name);
                }else if(drop_type === "city") {
                  setSelected(option);
                }
                setIsActive(false);
              }}
              className="dropdown-item"
            >
              {drop_type==="shipping"?(
              <div>
              <h5>{option[0]}</h5>
              <span>{option[1]}</span>
              </div>
              ):drop_type==="payment"?(
                <div className="payment_drop"><h4>{option[0]}</h4> <i className={option[1]}></i></div>
              ):drop_type==="states"?(<h5>{option}</h5>)
              :drop_type==="country" ?(<h5>{option.name}</h5>)
              :drop_type==="city"?(<h5>{option}</h5>)
              :""}
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
