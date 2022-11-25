import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import AddItem from "./AddItem";


interface dataTypes {
    id: number,
    image: string,
    link: string,
    count: number
}


const AddSettings: React.FC = () => {
    const [active, setActive] = useState<boolean>(false)
    const [addElements, setAddElements] = useState<JSX.Element[]>([])

    const open = ():void => {
        setActive(!active)
    }

    useEffect(()=> {
        axios   
            .get<dataTypes>('http://localhost:8080/api/admin/adds')
            .then((res: AxiosResponse) => {
                let data: dataTypes[] = res.data.data
                setAddElements([])
                data.forEach( (e: dataTypes) => {
                    setAddElements( (prev: JSX.Element[]) => {
                        return [...prev, <AddItem id={e.id} link={e.link} image={e.image} count={e.count} key={e.id} />]
                    })
                })
            })
    }, [])
    return(
        <React.Fragment>
            <div className={active ? "add-settings-container active" : "add-settings-container"}>
                <div className={active ? "expand exp-active" : "expand"} onClick={open}>
                    <i className="fa-solid fa-chevron-left" />
                </div>
                <h3 className="heading">SET ADD</h3>
                <div className="add-item-container">
                    <p>Link</p>
                    <p>Count</p>
                </div>
                {addElements}
            </div>
        </React.Fragment>
    )
}


export default AddSettings