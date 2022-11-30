import React, { useState } from "react";

export default function useErrorMessage () {
    const [error, setError] = useState<boolean>(false)
    const [errorTxt, setErrorTxt] = useState<string | undefined>('')
    
    const close = () => {
        setError(false)
    }

    const ErrorMessage = 
        <div className="err-message-center" style={error ? active : inactive}>
            <div className="err-message">
                <p>{errorTxt}</p>
                <div className="icon" onClick={close}>
                    <i className="fa-regular fa-circle-xmark"></i>
                </div>  
                
            </div>
        </div>
    
    return({ setError, setErrorTxt, ErrorMessage })
}




const inactive = {
    opacity: '0',
    transform: 'translateY(-150%)'
}

const active = {
    opacity: '1',
    transform: 'translateY(0)'
}