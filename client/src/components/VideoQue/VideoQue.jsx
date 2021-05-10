import React from 'react'
import './video-que-style.scss'
import LoadMore from '../LoadMore/LoadMore'

export default function VideoQue( { isPublic, videoArray, buttonFunction, menuOpen, closeMenu, ROUTE}) {
    let owner = isPublic? 'Newest':'Personal'
    let closeMenuKey = isPublic? 'publicMenuOpen':'privateMenuOpen';
    return (
        <div className='videoque'>
            <LoadMore content={`${owner} Videos`} handler={()=>{closeMenu(closeMenuKey,!menuOpen)}}/>
            {videoArray.map(video=>{
                return (
                    <div key={video._id} className={`videoque__videotile ${menuOpen? '':'hidden'}`}>
                        {<img src={`${ROUTE}/stream/${video.preview}`} alt="" className='videoque__videotile-preview'/>}
                        
                        <div className='videoque__videotile-textcontainer'>
                        <h3 className={`videoque__videotile-user ${!isPublic && 'hideuser'}`}> {video.username} </h3>
                        <p className='videoque__videotile-date'> {new Date(video.uploadTime).toDateString()}</p>
                        <button onClick={()=>{buttonFunction('videoOne',video.video)}} className='videoque__videotile-button'> 
                            Video Player 1</button>
                        <button onClick={()=>{buttonFunction('videoTwo',video.video)}} className='videoque__videotile-button'> 
                            Video Player 2</button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
