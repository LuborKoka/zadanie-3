import axios, { AxiosResponse } from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { context, contextInterface } from "../../App";
import useErrorMessage from "../../hooks/useErrorMessage";
import useFetch from "../../hooks/useFetch";
import MeasurementItem from "./MeasurementItem";
import { methodData } from "./Methods";


interface props {
    setMeasurements: React.Dispatch<React.SetStateAction<JSX.Element[]>>
}

interface response {
    message: string,
    measurementID: number,
    methodName: string,
    error?: any,
}



const Input: React.FC<props> = ({ setMeasurements })=> {
    const date = useRef<HTMLInputElement>(null)
    const value = useRef<HTMLInputElement>(null)
    const method = useRef<HTMLSelectElement>(null)
    const type = useRef<HTMLSelectElement>(null)

    const session: contextInterface | null = useContext(context)

    const [options, setOptions] = useState<JSX.Element[]>([])

    const {setError, setErrorTxt, ErrorMessage } = useErrorMessage()
    
    const { data } = useFetch(`http://localhost:8080/api/user/init/method/${session?.userID}`)

    const submit = ( e: React.FormEvent<EventTarget> ): void => {
        e.preventDefault()

        if (date.current?.value === '') {
            setError(true)
            setErrorTxt('Date not set')
            return
        }

        if ( value.current?.value === '' ) {
            setError(true)
            setErrorTxt('Weight not set')
            return
        }
            
        if ( options.length === 0 ) {
            setError(true)
            setErrorTxt('Create a method')
            return
        }
                
        const len = (i: string):number => {
            return i.toString().length
        }

        axios
            .put('http://localhost:8080/api/user/measurements', {
                params: {
                    userID: session?.userID,
                    method: method.current?.value,
                    date: date.current?.value,
                    value: value.current?.value,
                    type: type.current?.value
                }
            })
            .then( ( res: AxiosResponse ) => {
                
                let data: response = res.data
                if ( data.message === 'Success')
                    setMeasurements( ( prev: JSX.Element[] ) => {
                        return [...prev, <MeasurementItem date={date.current?.value} value={value.current?.value}
                        type={'Weight'} method={data.methodName}  setter={setMeasurements} id={data.measurementID} key={data.measurementID} />]
                    })
            })        
    }

    useEffect(()=> {
        if ( data === undefined ) return
        let d: methodData[] = data.data
        setOptions([])

        d.forEach((e: methodData) => {
            setOptions( (prev: JSX.Element[]) => {
                return [...prev, <option value={`${e.id}`} key={e.id}>{e.name}</option>]
            })
        } )
    }, [data])

    return(
        <React.Fragment>    
            {ErrorMessage}
            <div className="input-container">
                <form>
                    <div className="data">
                        <input type='date' ref={date} />
                        <input type='text' placeholder="Value" ref={value} />
                        <select placeholder="Type" ref={type}>
                            <option value={'Weight'}>Weight</option>
                            <option value={'Waist'}>Waist</option>
                            <option value={'Hips'}>Hips</option>
                        </select>
                        <select placeholder='Method' ref={method}>
                            {options}
                        </ select>
                    </div>
                    <button onClick={submit}>Submit</button>
                </form>
            </div>
        </React.Fragment>
    )
}



export default Input