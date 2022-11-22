import axios, { AxiosError, AxiosResponse } from "axios";
import React from "react";
import useErrorMessage from "../../hooks/useErrorMessage";


interface Props {
    name:  string,
    email: string,
    age: number,
    height: number,
    weight: number,
    id: number,
}

interface resType {
    message: string,
    error?: any
}

const UserItem: React.FC<Props> = ({ name, email, age, height, weight, id }) => {
    const { setError, setErrorTxt, ErrorMessage } = useErrorMessage()

    const handleClick = (e: React.FormEvent<EventTarget>): void => {
        e.preventDefault()

        axios   
            .delete(`http://localhost:8080/api/admin/delete/${id}`)
            .then( (res: AxiosResponse ) => {
                let data: resType = res.data
                if ( data.message === 'Success' ) {
                    setError(true)
                    setErrorTxt('User successfully deleted')
                }
            })
            .catch( ( e: AxiosError ) => {
                setError(true)
                setErrorTxt('Failed to delete user')
            })

    }

    return(
        <React.Fragment>
            { ErrorMessage }
            <div className="user-item">
                <h2>{name}</h2>
                <p>E-mail:</p>
                <p>{email}</p>
                <p>Age: {age}</p>
                <p>Height: {height}cm</p>
                <p>Weight: {weight}cm</p>


                <div className="center">
                    <button onClick={handleClick}>Delete User</button>
                </div>
            </div>
        </React.Fragment>
    )
}




export default UserItem