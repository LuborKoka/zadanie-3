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
    const method = useRef<HTMLInputElement>(null)
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

        let incorrectMethod: boolean = true

        options.forEach(( o: JSX.Element ) => {
            if ( o.props.value === method.current?.value ) {
                incorrectMethod = false
            }
        })

        if ( incorrectMethod ) {
            setError(true)
            if ( options.length === 0 )
                setErrorTxt('Create a method')
            else
                setErrorTxt('Select a method name from the list')

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


    useEffect(()=> {
        if ( data === undefined ) return
        let d: methodData[] = data.data
        setOptions([])

        d.forEach((e: methodData) => {
            setOptions( (prev: JSX.Element[]) => {
                return [...prev, <option value={`${e.name}`} key={e.id} />]
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
                        <input placeholder='Method' list='types' ref={method} />
                        <datalist id='types'>
                            {options}
                        </datalist>
                    </div>
                    <button onClick={submit}>Submit</button>
                </form>
            </div>
        </React.Fragment>
    )
}



export default Input