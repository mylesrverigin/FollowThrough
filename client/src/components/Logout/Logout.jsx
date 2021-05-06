import React from 'react'

const logoutCall = (history) => {
    localStorage.removeItem('followThroughAuth')
    history.push('/login')
}

export default function Logout( { history } ) {
    return (
        <div onClick={()=>{logoutCall(history)}}>
            <h2> 
                Logout
            </h2>
        </div>
    )
}
