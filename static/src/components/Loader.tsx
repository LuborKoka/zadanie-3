import React from "react"
import '../styles/loader.css'

interface Props {
    display: string
}


const Loader: React.FC<Props> = ({ display }) => {
    return(
        <React.Fragment>
            <div className="loader-container" style={{ display: display}}>
                <div className="loader">
                    <div className="animation"></div>
                    {<span>LOADING</span>}
                </div>
            </div>
        </React.Fragment>
    )
}


export default Loader