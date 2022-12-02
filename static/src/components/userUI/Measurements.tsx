import axios, { AxiosResponse } from "axios";
import React, { useContext, useEffect, useState } from "react";
import { context, contextInterface } from "../../App";
import useFetch from "../../hooks/useFetch";
import '../../styles/measurements.css'
import Loader from "../needlessUtility/Loader";
import Import from "./Import";
import Input from "./Input";
import MeasurementItem from "./MeasurementItem";

interface dataType {
    id: number,
    date: string,
    value: string,
    name: string,
    type: string,
    method_id: number
}

interface options {
    id: number,
    name: string,
    decription: string
}


const Measurements: React.FC = ()=> {
    const [measurements, setMeasurements] = useState<JSX.Element[]>([])
    const [element, setElement] = useState<JSX.Element>(<Input setMeasurements={setMeasurements}/>)
    const [active, setActive] = useState<boolean>(true)
    const [options, setOptions] = useState<JSX.Element[]>([])

    const session: contextInterface | null = useContext(context)

    const {data, loading} = useFetch(`http://localhost:8080/api/user/init/${session?.userID}`)

    useEffect(()=> {
        setMeasurements([])    
        if ( data !== undefined && data.message === 'Success' ) {
            let d: dataType[] = data.data
            d.forEach( (e: dataType) => {
                setMeasurements( ( prev: JSX.Element[] ) => {
                    return [...prev, <MeasurementItem date={e.date.slice(0, 10)} type={e.type} method_id={e.method_id} value={e.value} method={e.name} setter={setMeasurements} id={e.id} key={prev.length}/>]
                })
            })
        }
    }, [data])


    // options for filter
    useEffect(()=> {
        axios
            .get(`http://localhost:8080/api/user/method/init`)
            .then((e: AxiosResponse) => {
                setOptions([<option value={'None'}>None</option>])
                const d: {message: string, data: options[]} = e.data
                d.data.forEach((d: options) => {
                    setOptions((p: JSX.Element[]) => {
                        return [...p, <option value={d.name} key={d.id}>{d.name}</option>]
                    })
                })
            })
            // eslint-disable-next-line
    }, [])

    const filterElements = (ev: React.ChangeEvent<HTMLSelectElement>):void => {
        const d: dataType[] = data.data
        if ( ev.target.value === 'None' ) { 
            setMeasurements((p: JSX.Element[]) => {return []}) 
            d.forEach( (e: dataType) => {
                setMeasurements( ( prev: JSX.Element[] ) => {
                    return [...prev, <MeasurementItem date={e.date.slice(0, 10)} type={e.type} method_id={e.method_id} value={e.value} method={e.name} setter={setMeasurements} id={e.id} key={prev.length}/>]
                    
                })
            })
        }

        else {
            setMeasurements((p: JSX.Element[]) => {return []}) 
            d.forEach( (e: dataType) => {
                setMeasurements( ( prev: JSX.Element[] ) => {
                    if ( ev.target.value === e.name ) return [...prev, <MeasurementItem date={e.date.slice(0, 10)} method_id={e.method_id} type={e.type} value={e.value} method={e.name} setter={setMeasurements} id={e.id} key={prev.length}/>]
                    else return prev
                })
            })
        }
    }
    
    if ( loading ) return <Loader />

    

    return(
        <React.Fragment>
            <div className="measurements-container">
                <nav>
                    <div>
                        <p className={ active ? 'active' : undefined} onClick={ ()=>{ setElement(<Input setMeasurements={setMeasurements}/>); setActive(true) }}>INPUT</p>
                    </div>
                    <div>
                        <p className={ active ? undefined : 'active'} onClick= { ()=> {setElement(<Import setMeasurements={setMeasurements} />); setActive(false) }}>IMPORT</p>
                    </div>
                </nav>
                {element}
                <div className="filter">
                    <h3>Filter:</h3>
                    <select onChange={filterElements}>
                        {options}
                    </select>
                </div>
                <div className="measurements-list">
                    <div className="header">
                        <h3>Date</h3>
                        <h3>Type</h3>
                        <h3>Value</h3>
                        <h3>Method</h3>
                        <div></div>
                    </div>
                    <div className="list">
                        {measurements}  
                    </div>
                    
                </div>

                <div className="e-i-wrapper">  
                    <p>Export: </p>  
                    <a href={`http://localhost:8080/api/user/export/${session?.userID}`} download>
                        <i className="fa-solid fa-file-csv"></i>
                    </a>
                </div>
            </div>
        </React.Fragment>
    )
}



export default Measurements
