import axios, { AxiosResponse } from "axios";
import React, { useContext, useRef, useState } from "react";
import { context, contextInterface } from "../../App";
import useErrorMessage from "../../hooks/useErrorMessage";
import MeasurementItem from "./MeasurementItem";

interface data {
    date: string,
    type: string,
    value: string,
    method: number,
    id: number,
    methodID: number
}

interface props {
    setMeasurements: React.Dispatch<React.SetStateAction<JSX.Element[]>>
}

const Import: React.FC<props> = ({ setMeasurements }) => {
    const [file, setFile] = useState<File>()
    const input = useRef<HTMLInputElement>(null)
    const {setError, setErrorTxt, ErrorMessage} = useErrorMessage()

    const session: contextInterface | null = useContext(context)

    const updateFile = (): void => {
        if ( input === null || input.current === null || input.current.files === null) return
        setFile(input.current.files[0])
    }

    const submitFile = (e: React.FormEvent): void => {
        e.preventDefault()

        if ( input.current !== null && input.current.files?.length === 0 ) {
            setError(true)
            setErrorTxt('Select a file')
            return
        }

        const data = new FormData()
        if ( file === undefined ) return
        data.append('name', file.name)
        data.append('file', file)

        axios({
            method: 'POST',
            url: `http://localhost:8080/api/user/import/${session?.userID}`,
            headers: {
                ContentType: 'multipart/form-data'
            },
            data: data
        })
        .then( (e: AxiosResponse) => {
            const d: data[] = e.data.data

            d.forEach( (e: data) => {
                setMeasurements((p: JSX.Element[]) => {
                    return [...p, <MeasurementItem value={e.value} id={e.id} date={e.date} method_id={e.methodID} type={e.type} setter={setMeasurements} />]
                })
            })

        })
    }

    return(
        <React.Fragment>
            {ErrorMessage}
            <form className="import-measurements">
                <input type={'file'} accept={'.csv'} onChange={updateFile} ref={input}/>
                <button onClick={submitFile}>Submit</button>
            </form>
        </React.Fragment>
    )
}





export default Import