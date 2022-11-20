import axios, { AxiosError } from "axios";
import React, { useContext, useRef } from "react";
import { context } from "../../App";
import useErrorMessage from "../../hooks/useErrorMessage";
import Logout from "../navigation/Logout";


interface contextTypes {
    userID: number,
    sessionID: number,
    setUserID: React.Dispatch<React.SetStateAction<number>>,
    setSessionID: React.Dispatch<React.SetStateAction<number>>
  }

  interface dataType {
    message: string,
    finish: boolean
  }

const FinishRegistration: React.FC = () => {
    const age = useRef<HTMLInputElement | null>(null)
    const height = useRef<HTMLInputElement | null>(null)
    const weight = useRef<HTMLInputElement | null>(null)

    const session: contextTypes | null = useContext(context)

    const { setError, setErrorTxt, ErrorMessage } = useErrorMessage()

    const handleClick = (e: React.FormEvent<EventTarget>): void => {
        e.preventDefault()

        if ( age.current == null || height.current == null || weight.current == null ) return

        axios
            .post('http://localhost:8080/api/register/finish', {
                params: {
                    age: age.current.value,
                    height: height.current.value,
                    weight: weight.current.value,
                    id: session?.userID
                }
            })
            .catch( ( e: AxiosError ) => {
                const data: any = e.response?.data
                setError(true)
                setErrorTxt(data.message)
            })
    }

    return(
        <React.Fragment>
            { ErrorMessage }
            <div className='form-wrapper'>
                <div className="form">
                    <Logout />
                    <form>
                        <div className='form-input'>
                            <input type={'text'} name='age' autoComplete='off' required ref={age}></input>
                            <label htmlFor='age'><span>Age</span></label>
                        </div>
                        <div className='form-input'>
                            <input type={'text'} name='height' autoComplete='off' required ref={height}></input>
                            <label htmlFor='height'><span>Height</span></label>
                        </div>
                        <div className='form-input'>
                            <input type={'text'} name='Weight' autoComplete='off' required ref={weight}></input>
                            <label htmlFor='Weight'><span>Weight</span></label>
                        </div>
                        <div className='center'>
                            <button onClick={handleClick}>LOGIN</button>
                        </div>
                    </form>
                </div>
            </div>       
            </React.Fragment>
    )
}


export default FinishRegistration