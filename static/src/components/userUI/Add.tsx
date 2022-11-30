import axios, { AxiosError, AxiosResponse } from "axios";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { context, contextInterface } from "../../App";

interface dataTypes {
    link: string,
    image: string
}

const Add: React.FC = () => {
    const time = useRef<number>(0)
    const [active, setActive] = useState<boolean>(false)

    const [addData, setAddData] = useState<string[]>(['', ''])      //[link, image]

    
    const session: contextInterface | null = useContext(context)
 
    const clock = useCallback((): void => {
        time.current = time.current + 1
        if ( time.current === 60 ) {
            setActive(true)
            clearInterval(timer.current)
        } 
    }, [time])

    const incrAdd = ():void => {
        axios
            .patch(`http://localhost:8080/api/adds/inc/${session?.addID}`)
            .catch( ( e: AxiosError ) => {
                console.log('Failed to increment add count')
            } )
    }

    const closeAdd = (): void => {
        setActive(false)
        timer.current = setInterval(clock, 1000)
        time.current = 0        
    }

    const timer = useRef<ReturnType <typeof setInterval> | undefined>()

    useEffect( ()=> {
        timer.current = setInterval(clock, 1000)
        return( ()=> {
            clearInterval(timer.current)
        })
        // eslint-disable-next-line
    }, [])

    useEffect(()=> {
        if ( session === null ) return
        axios
            .get(`http://localhost:8080/api/user/add/${session.addID}`)
            .then( (res: AxiosResponse) => {
                let data: dataTypes = res.data.data
                setAddData([data.link, data.image])
            })
    }, [session])


    return(
        <React.Fragment>
            <div className={active ? "add-container active" : "add-container"}>
                <div className="header">
                    <div className="close-add" onClick={closeAdd}>
                        <p>Close</p>
                        <i className="fa-solid fa-xmark"></i>
                    </div>
                </div>
                <div className="add-image">
                    <a target='_blank' href={`${addData[0]}`} rel='noreferrer' onClick={incrAdd} >
                        <img width='150px' height='150px' alt='add_img' src={addData[1]} />
                    </a>
                </div>
            </div>

        </React.Fragment>
    )
}



export default Add