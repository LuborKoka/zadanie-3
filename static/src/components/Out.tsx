import React from 'react';

interface Props {
    state: string
}

const Child: React.FC<Props> = ({state}) => {
    return (
        <React.Fragment>
            <div>{state}</div>
        </React.Fragment>
    );
};

export default Child;