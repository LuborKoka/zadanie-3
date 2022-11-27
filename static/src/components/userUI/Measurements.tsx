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
    userID: number,
    type: string,
    date: string,
    value: string,
}


const Measurements: React.FC = ()=> {
    const [measurements, setMeasurements] = useState<JSX.Element[]>([])
    const [element, setElement] = useState<JSX.Element>(<Input setMeasurements={setMeasurements}/>)
    const [activeElement, setActiveElement] = useState<string>('input')

    const session: contextInterface | null = useContext(context)

    const {data, loading} = useFetch(`http://localhost:8080/api/user/init/${session?.userID}`)

    useEffect(()=> {
        setMeasurements([])    
        if ( data !== undefined && data.message === 'Success' ) {
            let d: dataType[] = data.data
            d.forEach( (e: dataType) => {
                setMeasurements( ( prev: JSX.Element[] ) => {
                    return [...prev, <MeasurementItem date={e.date} type={e.type} value={e.value} setter={setMeasurements} id={e.id} key={e.id}/>]
                })
            })
        }
    }, [data])
    
    if ( loading ) return <Loader />

    

    return(
        <React.Fragment>
            <div className="measurements-container">
                <nav>
                    <div>
                        <p onClick={ ()=>setElement(<Input setMeasurements={setMeasurements}/>)}>INPUT</p>
                    </div>
                    <div>
                        <p onClick= {()=>setElement(<Import  />)}>IMPORT</p>
                    </div>
                </nav>
                {element}
                <div className="measurements-list">
                    <div className="header">
                        <h3>Date</h3>
                        <h3>Type</h3>
                        <h3>Value</h3>
                        <div></div>
                    </div>
                    <div className="list">
                        {measurements}  
                    </div>
                    
                </div>

            </div>
        </React.Fragment>
    )
}



export default Measurements
