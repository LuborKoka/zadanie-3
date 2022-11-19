import React from "react";

//requires 2 states

interface types {
    errorTxt: string,
    error: boolean,
    setError: React.Dispatch<React.SetStateAction<boolean>>
}


const ErrorMsg: React.FC<types> = ({ error, errorTxt, setError}) => {
    const close = () => {
        setError(false)
    }

    return(
        <React.Fragment>
            <div className="err-message-center" style={error ? active : inactive}>
                <div className="err-message">
                    <p>{errorTxt}</p>
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