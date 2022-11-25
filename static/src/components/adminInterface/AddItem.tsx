import React, { useContext } from "react";
import { context, contextInterface } from "../../App";

interface props {
    id: number,
    image: string,
    link: string,
    count: number
}

const AddItem: React.FC<props> = ({ id, image, link, count}) => {

    const session: contextInterface | null = useContext(context)

    const setAdd = ():void => {
        if ( session !== null )
        session.add = id
    }

    return(
        <React.Fragment>
            <div className="add-item-container">
                <p className="link" onClick={setAdd}>{link}</p>
                <p>{count}</p>
            </div>
        </React.Fragment>
    )
}



export default AddItem