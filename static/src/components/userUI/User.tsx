import React from "react";
import Logout from "../navigation/Logout";
import Add from "./Add";
import '../../styles/user.css'
import Measurements from "./Measurements";



const User:React.FC = () => {
    return(
        <React.Fragment>
            <div className="user-container">
                <Add />
                <Measurements />
                <Logout />
            </div>

        </React.Fragment>
    )
}


export default User