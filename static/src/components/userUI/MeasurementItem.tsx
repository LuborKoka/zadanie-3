import axios, { AxiosResponse } from "axios";
import React, { useContext } from "react";
import { context, contextInterface } from "../../App";

interface props {
    date?: string,
    type?: string,
    value?: string,
    setter: React.Dispatch<React.SetStateAction<JSX.Element[]>>
    id: number,
    method?: string,
    method_id?: number
}

interface response {
    message: string,
    error?: any
}


const MeasurementItem: React.FC<props> = ({ date, type, value, setter, id, method, method_id })=> {
    const session: contextInterface | null = useContext(context)

    function deleteMeasurement():void {
        axios
            .delete(`http://localhost:8080/api/user/measurement/${session?.userID}/${id}/${type}`)
            .then( (res: AxiosResponse) => {
                let data: response = res.data
                if ( data.message === 'Success' ) {
                    setter( (prev: JSX.Element[]) => {
                        return (
                            prev.filter( (e: JSX.Element) => {
                                return e.props.id !== id
                            })
                        )
                    })
                }
            })
    }

    return(
        <React.Fragment>
            <p>{date}</p>
            <p>{type}</p>
            <p>{value}</p>
            <p>{`${method === undefined ? '' : method}  ${method_id === undefined ? '' : `id: ${method_id}`}`}</p>
            <div className="delete">
                <i className="fas fa-trash-alt" onClick={deleteMeasurement}/>
            </div>
        </React.Fragment>
    )
}



export default MeasurementItem