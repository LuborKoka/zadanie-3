import axios, { AxiosResponse } from "axios";
import React, { useContext } from "react";
import { context, contextInterface } from "../../App";


interface props {
    id: number,
    name?: string,
    description?: string,
    setElements: React.Dispatch<React.SetStateAction<JSX.Element[]>>
}

interface res {
    message: string
}


const MethodItem: React.FC<props> = ({ id, name, description, setElements }) => {
    const session: contextInterface | null = useContext(context)

    const del = (): void => {
        axios
            .delete(`http://localhost:8080/api/user/delete/method/${id}/${session?.userID}`)
            .then( ( res: AxiosResponse ) => {
                let data: res = res.data

                if ( data.message === 'Success') {
                    setElements( ( prev: JSX.Element[] ) => {
                        return prev.filter( (e: JSX.Element) => {
                            return e.props.id !== id
                        })
                    })
                }
            })
    }

    return(
        <React.Fragment>
            <p>{id}</p>
            <p>{name}</p>
            <p>{description}</p>
            <div className="trash" onClick={del}>
                <i className="fas fa-trash-alt" />
            </div>
        </React.Fragment>
    )
}



export default MethodItem