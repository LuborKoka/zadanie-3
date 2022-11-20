import React, { useContext, useRef } from 'react';
import Back from '../navigation/Back';
import axios, { AxiosError, AxiosResponse } from 'axios'
import { context } from '../../App';
import useErrorMessage from '../../hooks/useErrorMessage';
import { useNavigate } from 'react-router-dom';

interface dataTypes {
    register: boolean,
    serverError: boolean,
    message: string,
    userID?: number,
    sessionID?: number,
    error: any
}

const Register: React.FC = () => {
    const name = useRef<HTMLInputElement>(null)
    const pass = useRef<HTMLInputElement>(null)
    const passAgain = useRef<HTMLInputElement>(null)
    const errorInput = useRef<HTMLParagraphElement>(null)
    const email = useRef<HTMLInputElement>(null)

    const { setError, setErrorTxt, ErrorMessage } = useErrorMessage()
    
    const session = useContext(context)

    const navigate = useNavigate()

    const handleClick = (e: React.FormEvent<EventTarget>): void => {
        e.preventDefault()
        
        if ( pass.current == null || name.current == null || passAgain.current == null || email.current == null) return
        if ( pass.current.value === '' || name.current.value === '' || passAgain.current.value === '' ) return

        if ( pass.current.value.localeCompare(passAgain.current.value) )  return

        axios
            .post('http://localhost:8080/api/register', {
                params: {
                    name: name.current.value,
                    password: pass.current.value,
                    email: email.current.value
                }
            })
            .then( (res: AxiosResponse) => {
                const data: dataTypes = res.data
                if ( data.register ) {
                    session?.setSessionID(res.data.sessionID)
                    session?.setUserID(res.data.userID)
                    navigate('/register/finish')
                } 
            })
            .catch( (e: AxiosError) => {
                if ( e.response !== undefined ) {
                    let data: any = e.response.data
                    setError(true)
                    setErrorTxt(data.message)
                }
            })
        

    }

    const comparePasswords = () => {
        if ( pass.current == null || passAgain.current == null || errorInput.current == null ) return
        if ( pass.current.value.localeCompare(passAgain.current.value) === 0 ) {
            errorInput.current.style.display = 'none'
        } else {
            if ( passAgain.current.value === '') errorInput.current.style.display = 'none'
            else 
                errorInput.current.style.display = 'initial'
        }  
    }


    return(
        <React.Fragment>
            {ErrorMessage}
            <div className='form-wrapper'>
                <div className='form'>
                    <Back />
                    <h2 className='heading'>REGISTER</h2>
                    <form>
                        <div className='form-input'>
                            <input type={'text'} name='username' autoComplete='off' required ref={name}></input>
                            <label htmlFor='username'><span>Username</span></label>
                        </div>
                        <div className='form-input'>
                            <input type={'password'} name='password' autoComplete='off' required ref={pass}></input>
                            <label htmlFor='password'><span>Password</span></label>
                        </div>
                        <div className='form-input'>
                            <input type={'password'} name='passwordAgain' autoComplete='off' required ref={passAgain} onChange={comparePasswords}></input>
                            <label htmlFor='passwordAgain'><span>Password Again</span></label>
                        </div>
                        <div className='form-input'>
                            <input type={'email'} name='email' autoComplete='off' required ref={email}></input>
                            <label htmlFor='email'><span>E-mail</span></label>
                        </div>                        
                        <div style={style}>
                            <p ref={errorInput} style={{display: 'none'}}>*Password doesn't match</p>
                        </div>          
                        <div className='center'>
                            <button onClick={handleClick}>REGISTER</button>
                        </div>
                    </form>
                </div>
            </div>
        </React.Fragment>
    )
}


const style = {
    color: 'red',
    fontSize: '12px',
    alignItems: 'center',
    width: '100%',
    padding: '.3rem 0 0 27%',
    height: 'calc(12px + .3rem)'
}


export default Register