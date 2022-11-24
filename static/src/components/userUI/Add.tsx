import React, { useCallback, useEffect, useRef, useState } from "react";



const Add: React.FC = () => {
    const [time, setTime] = useState<number>(0)
    const [active, setActive] = useState<boolean>(false)

        //JE TO DOBUGOVANE
 
    const clock = useCallback((): void => {
        setTime( prev => prev + 1)
        if ( time === 60 ) {
            setActive(true)
        } 
    }, [time])

    const closeAdd = (): void => {
        setActive(false)
        setTime(0)        
    }

    const timer = useRef<ReturnType <typeof setInterval> | undefined>()

    useEffect( ()=> {
        timer.current = setInterval(clock, 1000)
        return( ()=> {
            clearInterval(timer.current)
        })
    }, [clock])


    return(
        <React.Fragment>
            <div className={active ? "add-container active" : "add-container"}>
                <div className="close-add" onClick={closeAdd}>
                    <p>Close<i className="fa-solid fa-xmark"></i></p>
                </div>
                <a target='_blank' href={'https://worldoftanks.eu'} rel='noreferrer'>
                    <img width='150px' height='150px' alt='add_img' src="https://img.icons8.com/external-those-icons-lineal-color-those-icons/24/null/external-ad-marketing-and-advertising-those-icons-lineal-color-those-icons.png"/>
                </a>
            </div>

        </React.Fragment>
    )
}



export default Add