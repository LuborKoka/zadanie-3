import React, { useRef } from 'react';
import '../../styles/login.css'
import Back from '../navigation/Back'
import axios from 'axios'


const Login: React.FC = () => {
    const name = useRef<HTMLInputElement>(null)
    const password = useRef<HTMLInputElement>(null)

    const handleClick = (e: React.FormEvent<EventTarget>): void => {
        e.preventDefault()
        
        if ( name.current != null && password.current != null) {
            window.alert(name.current.value + '\n' + password.current.value)
            axios
                .post('http://localhost:8080/api/login', {
                    params: {
                        name: name.current.value,
                        pass: password.current.value
                    }
                })
        }
    }   


    return(
        <React.Fragment>
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
