import React, { useRef } from 'react';
import Back from './navigation/Back';

interface Props {

}


const Register: React.FC<Props> = () => {
    const name = useRef<HTMLInputElement>(null)
    const pass = useRef<HTMLInputElement>(null)
    const passAgain = useRef<HTMLInputElement>(null)
    const error = useRef<HTMLParagraphElement>(null)

    const comparePasswords = () => {
        if ( pass.current != null && passAgain.current != null && error.current != null ) {
            if ( pass.current.value.localeCompare(passAgain.current.value) === 0 ) {
                error.current.style.display = 'none'
            } else {
                if ( passAgain.current.value === '') error.current.style.display = 'none'
                else 
                    error.current.style.display = 'initial'
            }

        }
    }


    return(
        <React.Fragment>
            <div className='form-wrapper'>
                <div className='form'>
                    <Back />
                    <h2 className='heading'>REGISTER</h2>
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
                    <div style={style}>
                        <p ref={error} style={{display: 'none'}}>*Password doesn't match</p>
                    </div>          
                    <div className='center'>
                        <button>REGISTER</button>
                    </div>
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