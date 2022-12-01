import React, { useEffect,  useRef,  useState } from "react";
import useFetch from "../../hooks/useFetch";
import Loader from "../needlessUtility/Loader";
import '../../styles/admin.css'
import UserItem from "./UserItem";
import Logout from "../navigation/Logout";
import useErrorMessage from "../../hooks/useErrorMessage";
import AddSettings from "./AddSettings";
import axios, { AxiosError, AxiosResponse } from "axios";

interface res {
    message: string,
    userID: number,
    name: string,
    age: number,
    weight: number,
    height: number,
    mail: string
}

interface users {
    id: number,
    name: string,
    age: number,
    weight: number,
    height: number,
    email: string
}

const AdminUI: React.FC = () => {
    // eslit-disable-next-line
    const {data, loading} = useFetch('http://localhost:8080/api/admin/init')

    const [usersCount, setUsersCount] = useState<number>(0)
    const [elements, setElements] = useState<JSX.Element[]>([])

    const [csv, setCsv] = useState<File>()

    const elDiv = useRef<HTMLDivElement>(null)
    const bdyDiv = useRef<HTMLDivElement>(null)
    const input = useRef<HTMLInputElement>(null)

    const name = useRef<HTMLInputElement>(null)
    const password = useRef<HTMLInputElement>(null)
    const confirmPassword = useRef<HTMLInputElement>(null)
    const mail = useRef<HTMLInputElement>(null)
    const age = useRef<HTMLInputElement>(null)
    const height = useRef<HTMLInputElement>(null)
    const weight = useRef<HTMLInputElement>(null)

    const { setError, setErrorTxt, ErrorMessage } = useErrorMessage()

    //list of users
    useEffect( ()=> {
        if (data !== undefined) {
            let d = JSON.parse(data.usersData)

            setElements(
                Object.entries(d).map( ( e: any ) => {
                    return <UserItem name={e[1].name} key={e[1].id} email={e[1].email} age={e[1].age}
                    height={e[1].height} weight={e[1].weight} id={e[1].id} setError={setError} setErrorTxt={setErrorTxt} setElements={setElements}/>
                })
            )
        }
    }, [data, setError, setErrorTxt])
    //styling, not important
    useEffect(()=> {
        setUsersCount(elements.length)
    }, [elements])

    //styling, not important
    useEffect(()=> {
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

    //import users
    const setFile = ():void => {
        if ( input.current === null || input.current.files === null ) return
        setCsv(input.current.files[0])
    }

    //submit csv file and import users
    const submit = (e: React.FormEvent<EventTarget>): void => {
        e.preventDefault()
        if ( input.current !== null && input.current.files?.length === 0 ) {
            setError(true)
            setErrorTxt('Select a file')
            return
        }

        const data = new FormData()
        if ( csv === undefined ) return
        data.append('name', csv.name)
        data.append('file', csv)

        axios({
            method: 'POST',
            url: 'http://localhost:8080/api/admin/import',
            headers: {
                ContentType: 'multipart/form-data'
            },
            data: data
        })
        .then((res: AxiosResponse) => {
            const data: users[] = res.data.users

            data.forEach((d: users) => {
                setElements((prev: JSX.Element[]) => {
                    return [...prev, <UserItem name={d.name} email={d.email} age={d.age} id={d.id} height={d.height} weight={d.weight}
                    setError={setError} setElements={setElements} setErrorTxt={setErrorTxt} />]
                })
            })
        })
        .catch(err => console.log(err));

    }

    //add user
    const submitUser = (e: React.FormEvent<EventTarget>): void => {
        e.preventDefault()
        if ( password.current?.value !== confirmPassword.current?.value ) {
            setError(true)
            setErrorTxt('Passwords must match')
            return
        }

        axios
            .post('http://localhost:8080/api/admin/adduser', {
                params: {
                    name: name.current?.value,
                    password: password.current?.value,
                    mail: mail.current?.value,
                    age: age.current?.value,
                    weight: weight.current?.value,
                    height: height.current?.value
                }
            })
            .then( (res: AxiosResponse) => {
                const data: res = res.data
                if ( data.message === 'Success' ) {
                    setError(true)
                    setErrorTxt('User successfully added')
                    setElements( (prev: JSX.Element[] ) => {
                        return [...prev, <UserItem name={data.name} key={data.userID} email={data.mail} age={data.age}
                        height={data.height} weight={data.weight} id={data.userID} setError={setError} setErrorTxt={setErrorTxt} setElements={setElements}/>]
                    })
                }
            })
            .catch( (err: AxiosError) => {
                console.log(err)
                setError(true)
                setErrorTxt(err.code)
            })
    }


    if ( loading ) return <Loader />


    return(
        <React.Fragment>
            {ErrorMessage}
            <div className="admin-wrapper">
                <div className="body-wrapper" ref={bdyDiv}>
                    <Logout />
                    <div className="elements-wrapper" ref={elDiv}>
                        {elements}
                    </div>

                    <div className="add-user">
                        <h1>Add User</h1>
                        <form className="input-container">
                            <div className='form-input'>
                                <input type={'text'} name='name' autoComplete='off' required ref={name}></input>
                                <label htmlFor='name'><span>Name</span></label>
                            </div> 
                            <div className='form-input'>
                                <input type={'password'} name='password' autoComplete='off' required ref={password} ></input>
                                <label htmlFor='password'><span>Password</span></label>
                            </div> 
                            <div className='form-input'>
                                <input type={'password'} name='confirmpassword' autoComplete='off' required ref={confirmPassword} ></input>
                                <label htmlFor='confirmpassword'><span>Confirm Password</span></label>
                            </div>
                            <div className='form-input'>
                                <input type={'email'} name='email' autoComplete='off' required ref={mail}></input>
                                <label htmlFor='email'><span>E-mail</span></label>
                            </div> 
                            <div className='form-input'>
                                <input type={'text'} name='age' autoComplete='off' required ref={age} ></input>
                                <label htmlFor='age'><span>Age</span></label>
                            </div> 
                            <div className='form-input'>
                                <input type={'text'} name='weight' autoComplete='off' required ref={weight} ></input>
                                <label htmlFor='weight'><span>Weight(kg)</span></label>
                            </div>
                            <div className='form-input'>
                                <input type={'text'} name='height' autoComplete='off' required ref={height} ></input>
                                <label htmlFor='height'><span>Height(cm)</span></label>
                            </div>

                            <button onClick={submitUser}>Submit</button>
                        </form>

                    </div>

                    <div className="export-wrapper">  
                        <p>Export: </p>  
                        <a href="http://localhost:8080/api/admin/export" download>
                            <i className="fa-solid fa-file-csv"></i>
                        </a>
                    </div>
                    <form className="import-container">
                        <p>Import: </p>
                        <input type={'file'} accept=".csv" ref={input} onChange={setFile} />
                        <button onClick={submit}>Submit</button>
                    </form>
                </div>
            </div>
            <AddSettings />
        </React.Fragment>
    )
}



export default AdminUI