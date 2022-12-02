import axios, { AxiosResponse } from "axios"
import React, { useContext, useEffect, useRef, useState } from "react"
import { context, contextInterface } from "../../App"
import MethodItem from "./MethodItem"
import '../../styles/method.css'
import useErrorMessage from "../../hooks/useErrorMessage"
import useFetch from "../../hooks/useFetch"

export interface methodData {
    id: number,
    name: string,
    description: string
}


const Methods: React.FC = () => {
    const session: contextInterface | null = useContext(context)
    const [elements, setElements] = useState<JSX.Element[]>([])

    const { setError, setErrorTxt, ErrorMessage } = useErrorMessage()

    const { data } = useFetch(`http://localhost:8080/api/user/init/method/${session?.userID}`)
    
    const name = useRef<HTMLInputElement>(null)
    const desc = useRef<HTMLInputElement>(null)

    useEffect(()=> {
        setElements([])

        if ( data !== undefined && data.message === 'Success' ) {
            let d: methodData[] = data.data

            d.forEach( (e: methodData) => {
                setElements(( prev: JSX.Element[]) => {
                    return [...prev, <MethodItem id={e.id} name={e.name} description={e.description} setElements={setElements} key={e.id}/>]
                })
            })
        }

        
    }, [data])


    const submit = (e: React.FormEvent ):void => {
        e.preventDefault()

        if ( name.current?.value === '' ) {
            setError(true) 
            setErrorTxt('Name is not set')
            return
        }

        if ( name.current?.value.length !== undefined && name.current?.value.length > 50 ) {
            setError(true)
            setErrorTxt('Method name is too long')
            return
        }

        if ( desc.current?.value === '' ) {
            setError(true)
            setErrorTxt('Description is not set')
            return
        }

        axios
            .put('http://localhost:8080/api/user/put/method', {
                params: {
                    userID: session?.userID,
                    name: name.current?.value,
                    description: desc.current?.value
                }
            })
            .then((r: AxiosResponse ) => {
                let data: {message: string, id: number} = r.data
                if ( data.message === 'Success' ) {
                    setElements(( prev: JSX.Element[] ) => {
                        return [...prev, <MethodItem id={data.id} name={name?.current?.value} description={desc?.current?.value}
                        setElements={setElements} key={data.id}/>]
                    })
                }
            })
    }


    return(
        <React.Fragment>
            { ErrorMessage }
            <div className="method-container">
                <div className="method-input">
                    <form>
                        <input type={'text'} placeholder='Name (Max 50 chars)' ref={name}/>
                        <input type={'text'} placeholder='Description' ref={desc}/>

                        <button onClick={submit}>Submit</button>
                    </form>
                </div>
                <div className="header">
                    <h3>ID</h3>
                    <h3>Name</h3>
                    <h3>Description</h3>
                    <div />
                </div>
                <div className="list">
                    {elements}
                </div>
            </div>
        </React.Fragment>
    )
}


export default Methods