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
    weight: string,
    waist: string,
    hips: string,
    name: string
}


const Measurements: React.FC = ()=> {
    const [measurements, setMeasurements] = useState<JSX.Element[]>([])
    const [element, setElement] = useState<JSX.Element>(<Input setMeasurements={setMeasurements}/>)

    const session: contextInterface | null = useContext(context)

    const {data, loading} = useFetch(`http://localhost:8080/api/user/init/${session?.userID}`)

    useEffect(()=> {
        setMeasurements([])    
        if ( data !== undefined && data.message === 'Success' ) {
            let d: dataType[] = data.data
            d.forEach( (e: dataType) => {
                setMeasurements( ( prev: JSX.Element[] ) => {
                    return [...prev, <MeasurementItem date={e.date.slice(0, 10)}  weight={e.weight} waist={e.waist} hips={e.hips} method={e.name} setter={setMeasurements} id={e.id} key={e.id}/>]
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
                        <h3>Weight</h3>
                        <h3>Waist</h3>
                        <h3>Hips</h3>
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
