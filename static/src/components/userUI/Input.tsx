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
    measurementID: number
    error?: any,
}



const Input: React.FC<props> = ({ setMeasurements })=> {
    const date = useRef<HTMLInputElement>(null)
    const weight = useRef<HTMLInputElement>(null)
    const method = useRef<HTMLSelectElement>(null)
    const waist = useRef<HTMLInputElement>(null)
    const hips = useRef<HTMLInputElement>(null)

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
            
        if ( options.length === 0 ) {
            setError(true)
            setErrorTxt('Create a method')
            return
        }
                



        axios
            .put('http://localhost:8080/api/user/measurements', {
                params: {
                    userID: session?.userID,
                    method: method.current?.value[0],
                    date: date.current?.value,
                    weight: weight.current?.value,
                    waist: waist.current?.value,
                    hips: hips.current?.value
                }
            })
            .then( ( res: AxiosResponse ) => {
                //console.log(method.current?.)
                let data: response = res.data
                if ( data.message === 'Success')
                    setMeasurements( ( prev: JSX.Element[] ) => {
                        return [...prev, <MeasurementItem date={date.current?.value} weight={weight.current?.value} waist={waist.current?.value}
                        hips={hips.current?.value} method={method.current?.value[1]}  setter={setMeasurements} id={data.measurementID} key={data.measurementID} />]
                    })
            })        
    }

    useEffect(()=> {
        if ( data === undefined ) return
        let d: methodData[] = data.data
        setOptions([])

        d.forEach((e: methodData) => {
            setOptions( (prev: JSX.Element[]) => {
                return [...prev, <option value={`${[e.id, e.name]}`} key={e.id}>{e.name}</option>]
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
                        <input type='text' placeholder="Weight" ref={weight} />
                        <input type='text' placeholder="Waist" ref={waist} />
                        <input type='text' placeholder="Hips"  ref={hips}/>
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