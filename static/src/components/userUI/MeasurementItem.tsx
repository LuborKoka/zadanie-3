import React from "react";

interface props {
    date?: string,
    type?: string,
    value?: string
}

const MeasurementItem: React.FC<props> = ({ date, type, value })=> {
    return(
        <React.Fragment>
            <p>{date}</p>
            <p>{type}</p>
            <p>{value}</p>
        </React.Fragment>
    )
}



export default MeasurementItem