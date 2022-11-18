import React from "react";
import { Link } from "react-router-dom";



const Logout: React.FC = () => {
    return(
        <React.Fragment>
            <div className="logout">
                <div>
                    <h2>{'LOGOUT'}</h2>
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                </div>
            </div>
        </React.Fragment>
    )
}



export default Logout