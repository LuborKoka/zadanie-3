import React from 'react'
import { Link } from "react-router-dom"
import '../../styles/home.css'


const Home: React.FC = () => {
    return(
        <div className='home'>
            <React.Fragment>         
                <Link to={'/login'}>
                    <div>
                    <span>LOGIN</span>
                    </div>
                </Link>            
                <Link to={'/register'}>
                    <div>
                        <span>REGISTER</span>
                    </div>
                </Link>
                <Link to={'/login/admin'}>
                    <div>
                        <span>ADMIN</span>
                    </div>
                </Link>                
            </React.Fragment>
        </div>
    )
}

export default Home