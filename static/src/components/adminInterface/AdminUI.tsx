import React, { useEffect,  useRef,  useState, useLayoutEffect } from "react";
import useFetch from "../../hooks/useFetch";
import Loader from "../needlessUtility/Loader";
import '../../styles/admin.css'
import UserItem from "./UserItem";
import Logout from "../navigation/Logout";



const AdminUI: React.FC = () => {
    // eslit-disable-next-line
    const {data, loading} = useFetch('http://localhost:8080/api/admin/init')
    const [usersCount, setUsersCount] = useState<number>(0)
    const [elements, setElements] = useState<any[]>([])
    const elDiv = useRef<HTMLDivElement>(null)
    const bdyDiv = useRef<HTMLDivElement>(null)

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

    useEffect(()=> {
        setUsersCount(elements.length)
    }, [elements])

    useLayoutEffect(()=> {
        if ( elDiv.current === null || bdyDiv.current == null ) return

        const e = elDiv.current
        const b = bdyDiv.current

        const resize = () => {
            let n = usersCount
            let mult = Math.min(n, Math.floor(b.offsetWidth / 312))
            e.style.width = `${312*mult}px`
        }

        resize()

        window.addEventListener('resize', resize)

        return(()=> {
            window.removeEventListener('resize', resize)
        })

    }, [usersCount])


    if ( loading ) return <Loader />

    

    


    return(
        <React.Fragment>
            <div className="admin-wrapper">
                <div className="body-wrapper" ref={bdyDiv}>
                    <Logout />
                    <div className="elements-wrapper" ref={elDiv}>
                        {elements}
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}



export default AdminUI