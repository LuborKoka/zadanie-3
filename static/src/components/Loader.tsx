import React from "react"

interface Props {
    display?: string
}


const Loader: React.FC<Props> = ({ display = 'flex' }) => {
    return(
        <React.Fragment>
            <div className="loader-container" style={{ display: display}}>
                <div className="loader" />
            </div>
        </React.Fragment>
    )
}


export default Loader