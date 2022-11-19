import React from "react";

interface types {
    error?: string
}


const ErrorMsg: React.FC<types> = () => {
    

    return(
        <React.Fragment>
            <div className="err-message-center">
                <div className="err-message">
                    <p>incorrect password</p>
                    <div className="icon" onClick={close}>
                        <i className="fa-regular fa-circle-xmark"></i>
                    </div>  
                    
                </div>
            </div>
        </React.Fragment>
    )
}


export default ErrorMsg


const inactive = {
    opacity: '0',
    transform: 'translateY(-150%)'
}

const active = {
    opacity: '1',
    transform: 'translateY(0)'
}