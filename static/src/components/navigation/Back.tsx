import React from "react"
import { Link } from "react-router-dom"


const Back: React.FC = () => {
    return(
        <React.Fragment>
            <div className='backHome'>
                <Link to={'/'}>
                    <div>
                        <i className="fa-solid fa-arrow-left-long"></i>
                        <h2>{'GO BACK'}</h2>
                    </div>
                </Link>
             </div>
        </React.Fragment>
    )
}




export default Back