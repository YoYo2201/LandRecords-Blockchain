import React from "react";
import './Alert.css';

export default function Alert(props) {
    const CapitalizeFirstChar = () => {
        if(props.alert.type === "success")
            return "Success:";
        else
            return "Danger:";
    }
  return (
    <>
    <div className="alertbox">
      <svg xmlns="http://www.w3.org/2000/svg" style={{display: 'none'}}>
        <symbol id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
          <path d={props.alert.d} />
        </symbol>
      </svg>
      <div className={`alert alert-${props.alert.type} d-flex align-items-center`} id='alertId' role="alert">
        <svg
          className="bi flex-shrink-0 me-2"
          width="24"
          height="24"
          role="img"
          aria-label={CapitalizeFirstChar}
        >
          <use xlinkHref="#check-circle-fill" />
        </svg>
        <div style={{fontFamily: "'Jomolhari', serif"}}>{props.alert.msg}</div>
      </div>
      </div>
    </>
  );
}
