import React from "react";


interface Props {
    name?:  string
}



const UserItem: React.FC<Props> = ({ name }) => {
    const handleClick = (e: React.FormEvent<EventTarget>): void => {
        e.preventDefault()
    }

    return(
        <React.Fragment>
            <div className="user-item">
                <h2>{name}</h2>

                <div className="center">
                    <button onClick={handleClick}>Delete User</button>
                </div>
            </div>
        </React.Fragment>
    )
}




export default UserItem