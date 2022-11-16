import React, { useRef } from 'react'

type Props = {
    callback(v: string): void;
};

export const Inp: React.FC<Props> = ({callback}) => {
    const input = useRef<HTMLInputElement>(null)
    const update = () => {
        if ( input.current != null)
        callback(input.current.value)
    }    

  return (
    <input type={'text'} onChange={update} ref={input}></input>
  )
}
