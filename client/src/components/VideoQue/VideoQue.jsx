import React from 'react'
import './video-que-style.scss'

export default function VideoQue( { isPublic, videoArray, buttonFunction }) {
    let owner = isPublic? 'Public':'Your'
    return (
        <div>
            <h2> {owner} Videos</h2>
            {videoArray.map(video=>{
                return (
                    <div key={video._id} className='videotile'>
                        <img src={`http://localhost:8080/stream/${video.preview}`} alt="" className='videotile-preview'/>
                        <h3> {video.username} </h3>
                        <p> {new Date(video.uploadTime).toDateString()}</p>
                        <button onClick={()=>{buttonFunction('videoOne',video.video)}}> Set Video 1</button>
                        <button onClick={()=>{buttonFunction('videoTwo',video.video)}}> Set Video 2</button>
                    </div>
                )
            })}
        </div>
    )
}
