import React from 'react'
import './close-video-style.scss'

export default function CloseVideo( { handler }) {
    return (
        <button className={`exitButton`} onClick={()=>{handler()}}> X </button>
    )
}
