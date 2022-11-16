import React, { useRef } from 'react';
import '../styles/login.css'
import Back from './navigation/Back'
import Loader from './Loader';


interface Props {

}



const Login: React.FC<Props> = () => {
    const name = useRef<HTMLInputElement>(null)
    const password = useRef<HTMLInputElement>(null)

    const handleClick = () => {
        if ( name.current != null && password.current != null) {
            window.alert(name.current.value + '\n' + password.current.value)
            fetch(`http://localhost:8080/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name.current.value,
                    pass: password.current.value
                }),
                mode: 'cors'
                
            })
        }
    }   


    return(
        <React.Fragment>
            <div className='form-wrapper'>
                <div className='form'>
                    <Back />
                    <h2 className='heading'>LOGIN</h2>
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
                </div>

            </div>
            <Loader display='none'/>
        </React.Fragment>
    )
}

export default Login
