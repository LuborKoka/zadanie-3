import axios, { AxiosResponse } from "axios";
import React, { useContext, useRef } from "react";
import { context, contextInterface } from "../../App";
import useErrorMessage from "../../hooks/useErrorMessage";
import MeasurementItem from "./MeasurementItem";


interface props {
    setMeasurements: React.Dispatch<React.SetStateAction<JSX.Element[]>>
}

interface response {
    message: string,
    measurementID: number
    error?: any,
}



const Input: React.FC<props> = ({ setMeasurements })=> {
    const date = useRef<HTMLInputElement>(null)
    const weight = useRef<HTMLInputElement>(null)
    const method = useRef<HTMLInputElement>(null)
    const waist = useRef<HTMLInputElement>(null)
    const hips = useRef<HTMLInputElement>(null)

    const session: contextInterface | null = useContext(context)

    const {setError, setErrorTxt, ErrorMessage } = useErrorMessage()

    const submit = ( e: React.FormEvent<EventTarget> ): void => {
        e.preventDefault()

        if (date.current?.value === '') {
            setError(true)
            setErrorTxt('Date not set')
            return
        }

        if ( weight.current?.value === '' ) {
            setError(true)
            setErrorTxt('Weight not set')
            return
        }

        if ( waist.current?.value === '' ) {
            setError(true)
            setErrorTxt('Waist circumference not set')
            return
        }

        if ( hips.current?.value === '' ) {
            setError(true)
            setErrorTxt('Hips circumference not set')
            return
        }   

        axios
            .put('http://localhost:8080/api/user/measurements', {
                params: {
                    userID: session?.userID,
                    method: method.current?.value,
                    date: date.current?.value,
                    weight: weight.current?.value,
                    waist: waist.current?.value,
                    hips: hips.current?.value
                }
            })
            .then( ( res: AxiosResponse ) => {
                let data: response = res.data
                if ( data.message === 'Success')
                    setMeasurements( ( prev: JSX.Element[] ) => {
                        return [...prev, <MeasurementItem date={date.current?.value} weight={weight.current?.value} waist={waist.current?.value}
                        hips={hips.current?.value} method={method.current?.value}  setter={setMeasurements} id={data.measurementID} key={data.measurementID} />]
                    })
            })

        
    }

    return(
        <React.Fragment>    
            {ErrorMessage}
            <div className="input-container">
                <form>
                    <div className="data">
                        <input type='date' ref={date} />
                        <input type='text' placeholder="Weight" ref={weight} />
                        <input type='text' placeholder="Waist" ref={waist} />
                        <input type='text' placeholder="Hips"  ref={hips}/>
                        <input placeholder='Method' list='types' ref={method} />
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