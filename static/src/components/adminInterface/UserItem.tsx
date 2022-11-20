import React from "react";


interface Props {
    name:  string,
    email: string,
    age: number,
    height: number,
    weight: number
}



const UserItem: React.FC<Props> = ({ name, email, age, height, weight }) => {
    const handleClick = (e: React.FormEvent<EventTarget>): void => {
        e.preventDefault()
    }

    return(
        <React.Fragment>
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