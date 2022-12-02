import React from "react"




const Loader: React.FC = () => {
    return(
        <React.Fragment>
            <div className="loader-container" style={{ display: 'flex'}}>
                <div className="loader" />
            </div>
        </React.Fragment>
    )
}


export default Loader