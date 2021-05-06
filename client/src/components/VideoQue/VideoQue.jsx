import React from 'react'
import { Link } from 'react-router-dom'

export default function VideoQue( { isPublic, videoArray }) {
    let owner = isPublic? 'Public':'Your'
    return (
        <div>
            <h2> {owner} Videos</h2>
            {videoArray.map(video=>{
                return (
                    <Link  key={video._id} to={`/videoplayer/${video.video}`}>
                    <div>
                        <h3> {video.username} </h3>
                        <p> {video.video} </p>
                        <p> {new Date(video.uploadTime).toDateString()}</p>
                    </div>
                    </Link>
                )
            })}
        </div>
    )
}
