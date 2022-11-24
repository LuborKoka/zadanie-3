import React from "react";
import Logout from "../navigation/Logout";
import Add from "./Add";
import '../../styles/user.css'



const User:React.FC = () => {
    return(
        <React.Fragment>
            <div className="user-container">
                <Logout />
                <Add />
            </div>

        </React.Fragment>
    )
}


export default User