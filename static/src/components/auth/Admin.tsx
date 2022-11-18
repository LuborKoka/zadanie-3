import React, { useRef } from 'react';
import Back from '../navigation/Back';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';


const Admin: React.FC = () => {
    const password = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()

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
            .then( (res) => {
                if ( res.data.login ) navigate('/admin')
            })
            .catch( (e: AxiosError) => {
                if ( e.response !== undefined) {
                    let err: any = e.response.data
                    window.alert(err.message)
                }
            })
    }


    return(
        <React.Fragment>
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