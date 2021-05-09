import React from 'react'
import './load-more.scss'

export default function LoadMore( {content, handler}) {
    return (
        <div className='loadmore__container' onClick={()=>{handler()}}>
            <h2 className='loadmore__container-content'>
                {content}
            </h2>
        </div>
    )
}
