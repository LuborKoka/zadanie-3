import React, { useContext, useRef, useState } from 'react';
import Back from '../navigation/Back';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import { context } from '../../App';
import ErrorMsg from '../needlessUtility/ErrorMsg';

interface dataTypes {
    login: Boolean,
    message: string,
    userID?: number,
    sessionID?: number,
    error?: any
}

const Admin: React.FC = () => {
    const [error, setError] = useState<boolean>(false)
    const [errorTxt, setErrorTxt] = useState<string>('')

    const password = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()
    const session = useContext(context)

    const handleClick = (e: React.FormEvent<EventTarget>): void => {
        e.preventDefault()

        if ( password.current == null ) return
        if ( password.current.value === '' ) return

        
        axios  
            .post('http://localhost:8080/api/login', {
                params: {
                    name: 'Admin',
                    password: password.current.value
                }
            })
            .then( (res: AxiosResponse) => {
                const data: dataTypes = res.data
                if ( data.login ) {
                    session?.setSessionID(res.data.sessionID)
                    session?.setUserID(res.data.userID)
                    navigate('/admin')
                }
            })
            .catch( (e: AxiosError) => {
                if ( e.response !== undefined) {
                    let err: any = e.response.data
                    setError(true)
                    setErrorTxt(err.message)
                }
            })
    }


    return(
        <React.Fragment>
            <ErrorMsg error={error} errorTxt={errorTxt} setError={setError} />
            <div className='form-wrapper'>
                <div className='form'>
                    <Back />
                    <h2 className='heading'>LOGIN AS ADMIN</h2>
                    <form>
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

export default Admin