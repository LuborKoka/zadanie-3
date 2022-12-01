import React, { useState } from "react";
import Logout from "../navigation/Logout";
import Add from "./Add";
import '../../styles/user.css'
import Measurements from "./Measurements";
import Methods from "./Methods";
import Graph from "./Graph";



const User:React.FC = () => {
    const [element, setElement] = useState<JSX.Element>(<Measurements />)
    const [active, setActive] = useState<string>('measurements')

    return(
        <React.Fragment>
            <div className="user-container">
                <Add />
                <nav className="user-primary-navigation">
                    <div className="link" onClick={()=> {setElement(<Measurements />); setActive('measurements')}}>
                        <h2>Measurements</h2>
                        <div className={active === 'measurements' ? 'active' : ''}></div>
                    </div>
                    <div className="link" onClick={()=> {setElement(<Methods />); setActive('methods')}}>
                        <h2>Methods</h2>
                        <div className={active === 'methods' ? 'active' : ''}></div>
                    </div>
                    <div className="link" onClick={()=> {setElement(<Graph />); setActive('graph')}}>
                        <h2>Graph</h2>
                        <div className={active === 'graph' ? 'active' : ''}></div>
                    </div>
                </nav>
                {element}
                <Logout />
            </div>

        </React.Fragment>
    )
}


export default User