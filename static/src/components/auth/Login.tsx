import React, { useContext, useRef } from 'react';
import '../../styles/login.css'
import Back from '../navigation/Back'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { context } from '../../App';
import useErrorMessage from '../../hooks/useErrorMessage';
import { useNavigate } from 'react-router-dom';

interface dataTypes {
    login: Boolean,
    message: string,
    userID?: number,
    sessionID?: number,
    error?: any,
    age: number
}

const Login: React.FC = () => {
    const name = useRef<HTMLInputElement>(null)
    const password = useRef<HTMLInputElement>(null)

    const { setError, setErrorTxt, ErrorMessage } = useErrorMessage()

    const session = useContext(context)

    const navigate = useNavigate()

    const handleClick = (e: React.FormEvent<EventTarget>): void => {
        e.preventDefault()
        
        if ( name.current != null && password.current != null) {
            axios
                .post('http://localhost:8080/api/login', {
                    params: {
                        name: name.current.value,
                        pass: password.current.value
                    }
                })
                .then( (res: AxiosResponse) => {
                    const data: dataTypes = res.data
                    if ( data.login ) {
                        session?.setSessionID(res.data.sessionID)
                        session?.setUserID(res.data.userID)

                        if ( data.age == null || data.age == undefined || data.age == NaN ) 
                            navigate('/register/finish')
                        else 
                            navigate('/user')
                    }
                })
                .catch( ( e: AxiosError) => {
                    if ( e.response !== undefined ) {
                        let data: any = e.response.data
                        setError(true)
                        setErrorTxt(data.message)
                    }
                }) 
        }
    }   


    return(
        <React.Fragment>
            { ErrorMessage }
            <div className='form-wrapper'>
                <div className='form'>
                    <Back />
                    <h2 className='heading'>LOGIN</h2>
                    <form>
                        <div className='form-input'>
                            <input type={'text'} name='username' autoComplete='off' required ref={name}></input>
                            <label htmlFor='username'><span>Username</span></label>
                        </div>
                        <div className='form-input'>
                            <input type={'password'} name='password' required ref={password}></input>
                            <label htmlFor='password'><span>Password</span></label>
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

export default Login
