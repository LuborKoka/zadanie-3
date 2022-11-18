import React, { useEffect, useRef, useState } from "react";
import useFetch from "../../hooks/useFetch";
import Loader from "../Loader";
import '../../styles/admin.css'
import UserItem from "./UserItem";



const AdminUI: React.FC = () => {
    // eslit-disable-next-line
    const {data, loading} = useFetch('http://localhost:8080/api/admin/init')
    const [elements, setElements] = useState<any[]>([])
    const div = useRef<HTMLDivElement>(null)

    useEffect( ()=> {
        if (data !== undefined) {
            let d = JSON.parse(data.usersData)

            setElements(
                Object.entries(d).map( ( e: any ) => {
                    return <UserItem name={e[1].name} key={e[1].id}/>
                })
            )
        }
    }, [data])

    useEffect( ()=> {
        const element = div.current
        const handleResize = () => {
            if ( element !== null ) {
                let size  = ( element.offsetWidth % (250 + element.offsetWidth*0.04 ) ) / 2
                element.style.padding = `5vh calc(${size}px + 4vw)`
            }
            
        }
        window.addEventListener('resize', handleResize)
        window.addEventListener('load', handleResize)
        
        return( ()=> {
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('load', handleResize)
        })
        // eslint-disable-next-line
    }, [div.current])

    if ( loading ) return <Loader />

    

    


    return(
        <React.Fragment>
            <div className="admin-wrapper" >
                <div className="elements-wrapper" ref={div}>
                    {elements}
                </div>
            </div>
        </React.Fragment>
    )
}



export default AdminUI