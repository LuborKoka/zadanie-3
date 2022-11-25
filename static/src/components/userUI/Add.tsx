import axios, { AxiosResponse } from "axios";
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

        //JE TO DOBUGOVANE
        //uz to neni dobugovane
 
    const clock = useCallback((): void => {
        time.current = time.current + 1
        if ( time.current === 5 ) {
            setActive(true)
            clearInterval(timer.current)
        } 
    }, [time])

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
            .get(`http://localhost:8080/api/user/add/${session.add}`)
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
                <a target='_blank' href={`https://${addData[0]}`} rel='noreferrer'>
                    {/*<img width='150px' height='150px' alt='add_img' src="https://img.icons8.com/external-those-icons-lineal-color-those-icons/24/null/external-ad-marketing-and-advertising-those-icons-lineal-color-those-icons.png"/>*/}
                    {`https://${addData[0]}`}
                </a>
            </div>

        </React.Fragment>
    )
}



export default Add