import React, { Component } from 'react'
import './video-player-style.scss'

export default class VideoPlayer extends Component {
    render() {
        let {video1, video2} = this.props.match.params
        return (
            <div>
                PLAYER
                {this.props.player}
                {video1 && <video src={`http://localhost:8080/stream/${video1}`} type='video/mp4' id='video' controls></video>}
                {/* {video2 && <video src={`http://localhost:8080/streamAlt/${video2}`} type='video/mp4' controls></video>} */}
            </div>
        )
    }
}
