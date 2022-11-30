import axios, { AxiosResponse } from "axios";
import React, { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import { context, contextInterface } from "../../App";
import AddItem from "./AddItem";


interface dataTypes {
    id: number,
    image: string,
    text: string,
    link: string,
    count: number
}

export interface addTypes {
    addID: number | undefined,
    setAddID: React.Dispatch<React.SetStateAction<number | undefined>>
}

export const addContext = createContext<addTypes | null>(null)


const AddSettings: React.FC = () => {
    const [active, setActive] = useState<boolean>(false)
    const [addElements, setAddElements] = useState<JSX.Element[]>([])

    const session: contextInterface | null = useContext(context)
    const [addID, setAddID] = useState<number | undefined>(session?.addID)

    const adds: addTypes = {
        addID: addID,
        setAddID: setAddID
    }

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
                        return [...prev, <AddItem id={e.id} text={e.text} count={e.count} key={e.id} />]
                    })
                })
            })
    }, [])
    return(
        <React.Fragment>
            <addContext.Provider value={adds}>
                <div className={active ? "add-settings-container active" : "add-settings-container"}>
                    <div className={active ? "expand exp-active" : "expand"} onClick={open}>
                        <i className="fa-solid fa-chevron-left" />
                    </div>
                    <h3 className="heading">SET ADD</h3>
                    <div className="add-item-container">
                        <p className="table-header">Link</p>
                        <p className="table-header">Count</p>
                    </div>
                    {addElements}
                </div>
            </addContext.Provider>
        </React.Fragment>
    )
}


export default AddSettings