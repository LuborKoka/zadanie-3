import axios, { AxiosResponse } from "axios";
import React, { useContext, useRef } from "react";
import { context, contextInterface } from "../../App";
import useErrorMessage from "../../hooks/useErrorMessage";
import MeasurementItem from "./MeasurementItem";


interface props {
    setMeasurements: React.Dispatch<React.SetStateAction<JSX.Element[]>>
}


const Input: React.FC<props> = ({ setMeasurements })=> {
    const date = useRef<HTMLInputElement>(null)
    const value = useRef<HTMLInputElement>(null)
    const type = useRef<HTMLInputElement>(null)

    const session: contextInterface | null = useContext(context)

    const {setError, setErrorTxt, ErrorMessage } = useErrorMessage()

    const submit = ( e: React.FormEvent<EventTarget> ): void => {
        e.preventDefault()

        if (date.current?.value === '') {
            setError(true)
            setErrorTxt('Unset date')
            return
        }

        if ( value.current?.value === '' ) {
            setError(true)
            setErrorTxt('Unset value')
            return
        }

        if ( type.current?.value !== 'Weight' && type.current?.value !== '2nd param' && type.current?.value !== '3rd param' ) {
            setError(true)
            setErrorTxt('Invalid or unset type value')
            return
        }
        
        axios
            .put('http://localhost:8080/api/user/measurements', {
                params: {
                    userID: session?.userID,
                    type: type.current.value,
                    date: date.current?.value,
                    value: value.current?.value
                }
            })
            .then( ( res: AxiosResponse ) => {
                if ( res.data.message === 'Success')
                    setMeasurements( ( prev: JSX.Element[] ) => {
                        return [...prev, <MeasurementItem date={date.current?.value} value={value.current?.value} type={type.current?.value} key={res.data.measurementID}/>]
                    })
            })

        
    }

    return(
        <React.Fragment>    
            {ErrorMessage}
            <div className="input-container">
                <form>
                    <div className="data">
                        <input type={'date'} ref={date}></input>
                        <input type='text' id='value' placeholder="value" ref={value}></input>
                        <input list='types' ref={type} />
                        <datalist id='types'>
                            <option value={'Weight'} />
                            <option value={'2nd param'} />
                            <option value={'3rd param'} />
                        </datalist>
                    </div>
                    <button onClick={submit}>Submit</button>
                </form>
            </div>
        </React.Fragment>
    )
}



export default Input