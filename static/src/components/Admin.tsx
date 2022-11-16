import React from 'react';
import Back from './navigation/Back';


interface Props {

}

const Admin: React.FC<Props> = () => {
    return(
        <React.Fragment>
            <div className='form-wrapper'>
                <div className='form'>
                    <Back />
                    <h2 className='heading'>LOGIN AS ADMIN</h2>
                    <div className='form-input'>
                        <input type={'password'} name='password' required></input>
                        <label htmlFor='password'><span>Password</span></label>
                    </div>
                    <div className='center'>
                        <button>LOGIN</button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Admin