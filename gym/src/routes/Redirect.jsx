import React, { useEffect } from 'react';

function Redirect() {

    useEffect(() => {
        window.location.href = '/carga';
    }, []);

    return (
        <div></div>
    )
}

export default Redirect;