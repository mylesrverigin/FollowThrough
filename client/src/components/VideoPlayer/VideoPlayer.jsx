import React, { Component } from 'react'
import './video-player-style.scss'

export default class VideoPlayer extends Component {
    // these are set as variables because setState has delay and they aren't dynamic
    videoOneBaseSpeed = 1
    videoTwoBaseSpeed = 1
    multiSpeed = 1
    videoOneStart = 0
    videoTwoStart = 0

    state = {
        videoOneOpactiy: 1.0,
        videoTwoOpacity: 1.0,
    }

    changeSliderValue = (event) => {
        // handles singles slider changes to opacity and video speed
        let update = {}
        update[event.target.name] = event.target.value / 100
        if (['videoOneSpeed', 'videoTwoSpeed'].includes(event.target.name)) {
            let id;
            let currentSpeedMult = update[event.target.name]
            if (event.target.name === 'videoOneSpeed') {
                id = 'videoOne'
                this.videoOneBaseSpeed = currentSpeedMult
            } else {
                id = 'videoTwo'
                this.videoTwoBaseSpeed = currentSpeedMult
            }
            document.getElementById(id).playbackRate = this.multiSpeed * currentSpeedMult > 0.1 ? this.multiSpeed * currentSpeedMult : 0.1
            return
        }
        this.setState(update)
    }

    singlePlay = (id) => {
        let video = document.getElementById(id)
        if (video.paused) {
            video.play()
        } else {
            video.pause()
        }
    }

    allplay = () => {
        // meant to play or pause all videos to keep them synced 
        let v1 = document.getElementById('videoOne')
        let v2 = document.getElementById('videoTwo')
        if (v1.paused) {
            v1.play()
            v2 && v2.play()
        } else {
            v1.pause()
            v2 && v2.pause()
        }
    }

    setSyncSpeed = (v1, v2) => {
        // takes in 2 videos elements and returns in order of insertion the length correction factor 
        return v1.duration > v2.duration ? [v1.duration / v2.duration, 1] : [1, v2.duration / v1.duration]
    }

    videoSync = () => {
        let v1 = document.getElementById('videoOne')
        let v2 = document.getElementById('videoTwo')
        if (!v1 || !v2) { return }
        // calculate base speeds here 
        let [v1Speed, v2Speed] = this.setSyncSpeed(v1, v2)
        this.videoOneBaseSpeed = v1Speed
        this.videoTwoBaseSpeed = v2Speed
        v1.playbackRate = v1Speed
        v2.playbackRate = v2Speed
    }

    multiVideoSpeedControl = (event) => {
        // use this as the only form of video speed control check 
        // sync flag to determine what speed to use 
        let v1 = document.getElementById('videoOne')
        let v2 = document.getElementById('videoTwo')
        let speed = event.target.value / 100
        v1.playbackRate = speed * this.videoOneBaseSpeed > 0.1 ? speed * this.videoOneBaseSpeed : 0.1
        v2.playbackRate = speed * this.videoTwoBaseSpeed > 0.1 ? speed * this.videoTwoBaseSpeed : 0.1
        this.multiSpeed = speed
    }

    setStartTime = (id) => {
        let videoTime = document.getElementById(id).currentTime
        if (id === 'videoOne') {
            this.videoOneStart = videoTime
        } else {
            this.videoTwoStart = videoTime
        }
    }

    setVideoFromStartTime = (id) => {
        let video = document.getElementById(id)
        let time;
        if (id === 'videoOne') {
            time = this.videoOneStart
        } else {
            time = this.videoTwoStart
        }
        video.pause()
        video.currentTime = time
        video.play()
    }


    render() {
        let { video1, video2 } = this.props
        console.log(video1)
        return (
            <div className='player'>
                {video1 && <div className='player__one'>
                    <video
                        src={`http://localhost:8080/stream/${video1}`}
                        style={{ opacity: this.state.videoOneOpactiy }}
                        type='video/mp4'
                        id='videoOne'
                        className='player__one-video'
                        muted
                    />
                    <div className='player__one-controls'>
                        <label htmlFor="videoOneOpacity"> Video Opacity </label>
                        <input
                            type="range"
                            min="1"
                            max="100"
                            defaultValue='100'
                            name='videoOneOpactiy'
                            onChange={this.changeSliderValue}
                        />
                        <label htmlFor="videoOneSpeed"> Video Speed </label>
                        <input
                            type="range"
                            min="10"
                            max="300"
                            defaultValue='100'
                            name='videoOneSpeed'
                            onChange={this.changeSliderValue}
                        />
                        <div className='player__one-controls-buttons'>
                            <button onClick={() => { this.singlePlay('videoOne') }}> Play </button>
                            <button onClick={() => { this.setStartTime('videoOne') }}> Set Loop </button>
                            <button onClick={() => { this.setVideoFromStartTime('videoOne') }}> Loop </button>
                        </div>
                    </div>
                </div>}
                {video2 && <div className='player__two'>
                    <video
                        src={`http://localhost:8080/streamAlt/${video2}`}
                        style={{ opacity: this.state.videoTwoOpactiy }}
                        type='video/mp4'
                        id='videoTwo'
                        className='player__Two-video'
                        muted
                    />
                    <div className='player__two-controls'>
                        <label htmlFor="videoTwoOpacity"> Video Opacity </label>
                        <input
                            type="range"
                            min="1"
                            max="100"
                            defaultValue='100'
                            name='videoTwoOpactiy'
                            onChange={this.changeSliderValue}
                        />
                        <label htmlFor="videoTwoSpeed"> Video Speed </label>
                        <input
                            type="range"
                            min="10"
                            max="300"
                            defaultValue='100'
                            name='videoTwoSpeed'
                            onChange={this.changeSliderValue}
                        />
                        <div className='player__two-controls-buttons'>
                            <button onClick={() => { this.singlePlay('videoTwo') }}> Play </button>
                            <button onClick={() => { this.setStartTime('videoTwo') }}> Set Loop </button>
                            <button onClick={() => { this.setVideoFromStartTime('videoTwo') }}> Loop </button>
                        </div>
                    </div>
                </div>}
                {video1 && video2 && <div className='player__allControls'>
                    <button onClick={this.allplay}> Play All </button>
                    <button onClick={this.videoSync}> Sync Speed </button>
                    <button onClick={()=>{
                        ['videoOne','videoTwo'].forEach(el=>{
                            console.log(el)
                            this.setVideoFromStartTime(el)
                        })
                    }}> Loop All </button>
                    <label htmlFor="allVideoSpeed"> All Video Speed </label>
                    <input
                        type="range"
                        min="10"
                        max="300"
                        defaultValue='100'
                        name='allVideoSpeed'
                        onChange={this.multiVideoSpeedControl} />
                </div>}
            </div>
        )
    }
}
