import axios, { AxiosResponse } from "axios";
import React, { SyntheticEvent, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { context } from "../../App";

interface types {
    message: string,
    logout: boolean,
    serverError: boolean
}

const Logout: React.FC = () => {
    const navigate = useNavigate()
    const session = useContext(context)

    const handleLogout = (e: SyntheticEvent) => {
        e.preventDefault()
        axios
            .delete('http://localhost:8080/api/logout', {
                data: {
                    userID: session?.userID,
                    sessionID: session?.sessionID
                }
            })
            .then( (res: AxiosResponse) => {
                const data: types = res.data
                if ( data.logout ) {
                    navigate('/')
                }
            })
    }
    return(
        <React.Fragment>
            <div className="logout" onClick={handleLogout}>
                <div>
                    <h2>{'LOGOUT'}</h2>
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                </div>
            </div>
        </React.Fragment>
    )
}



export default Logout