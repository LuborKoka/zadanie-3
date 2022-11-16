import { useEffect, useState } from "react";
import axios from 'axios'


export default function useFetch(url: string) {
    const [data, setData] = useState<any>()
    const [loading, setLoading] = useState<Boolean>(false)
    const [error, setError] = useState<Boolean>(false)

    useEffect( ()=> {
        setLoading(true)
        axios
            .get(url)
            .then( (res) => {
                setData(res.data)
            })
            .catch( (e) => {
                console.log(e)
                setError(true)
            })
            .finally( ()=> {
                setLoading(false)
            })

    }, [url])
    

    return {data, loading, error}
}