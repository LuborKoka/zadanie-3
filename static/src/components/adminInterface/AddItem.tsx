import React, { useContext, useEffect, useState } from "react";
import { context, contextInterface } from "../../App";
import { addContext, addTypes } from "./AddSettings";

interface props {
    id: number,
    text: string,
    count: number
}

const AddItem: React.FC<props> = ({ id, text, count}) => {

    const session: contextInterface | null = useContext(context)
    const adds: addTypes | null = useContext(addContext)

    const [active, setActive] = useState<boolean>(false)

    useEffect(()=> {
        if ( adds === null ) return
        if ( adds.addID === id ) setActive(true)
        else setActive(false)

    }, [adds, id])

    const setAdd = ():void => {
        if ( session === null || adds === null ) return
        session.addID = id
        adds.setAddID(id)
    }

    return(
        <React.Fragment>
            <div className="add-item-container">
                <div className="link" >
                    <p onClick={setAdd}>{text}</p>
                    <i className={active ? "fa-solid fa-circle-check active" : "fa-solid fa-circle-check"} />
                </div>
                <p className="count">{count}</p>
            </div>
        </React.Fragment>
    )
}



export default AddItem