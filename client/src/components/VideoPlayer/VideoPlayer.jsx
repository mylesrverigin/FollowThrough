import React, { Component } from 'react'
import './video-player-style.scss'
import CloseVideo from '../CloseVideo/CloseVideo'

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
        overlay: false
    }

    toggleOverlay = () => {
        let newOverlayValue = !this.state.overlay
        let [newVideoOneOpacity,newVideoTwoOpacity] = !newOverlayValue? [1.0,1.0]:[0.5,0.7]
        this.setState({
            overlay: newOverlayValue,
            videoOneOpactiy: newVideoOneOpacity,
            videoTwoOpacity: newVideoTwoOpacity
        })
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
        // deprecated 
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
        return (
            <>
                <div className='player'>
                    {video1 && <div className={`player__one ${this.state.overlay ? 'overlay' : 'relative'}`}>
                        <video
                            src={`${this.props.ROUTE}/stream/${video1}`}
                            style={{ opacity: this.state.videoOneOpactiy }}
                            type='video/mp4'
                            id='videoOne'
                            className='player__one-video'
                            muted
                        />
                        {/* Yes I agree its hacky */}
                        { video1 && video2 && !this.state.overlay && <CloseVideo handler={()=>{this.props.closeVideo('videoOne','')}}/>}
                        <div className={`player__one-controls ${this.state.overlay ? 'hidden' : ''}`}>
                            <label
                                htmlFor="videoOneSpeed"
                                className='player__one-controls-label'
                            > Video Speed </label>
                            <input
                                type="range"
                                min="10"
                                max="300"
                                defaultValue='100'
                                name='videoOneSpeed'
                                onChange={this.changeSliderValue}
                                className='player__one-controls-slider'
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
                            src={`${this.props.ROUTE}/streamAlt/${video2}`}
                            style={{ opacity: this.state.videoTwoOpactiy }}
                            type='video/mp4'
                            id='videoTwo'
                            className='player__two-video'
                            muted
                        />
                        { video1 && video2 && !this.state.overlay && <CloseVideo handler={()=>{this.props.closeVideo('videoTwo','')}}/>}
                        <div className={`player__two-controls ${this.state.overlay ? 'hidden' : ''}`}>
                            <label htmlFor="videoTwoSpeed" className='player__two-controls-label'> Video Speed </label>
                            <input
                                type="range"
                                min="10"
                                max="300"
                                defaultValue='100'
                                name='videoTwoSpeed'
                                onChange={this.changeSliderValue}
                                className='player__two-controls-slider'
                            />
                            <div className='player__two-controls-buttons'>
                                <button onClick={() => { this.singlePlay('videoTwo') }}> Play </button>
                                <button onClick={() => { this.setStartTime('videoTwo') }}> Set Loop </button>
                                <button onClick={() => { this.setVideoFromStartTime('videoTwo') }}> Loop </button>
                            </div>
                        </div>
                    </div>}
                </div>
                {video1 && video2 && <div className='player__allControls'>
                    {this.state.overlay && <>
                        <div className='player__allControls-buttons'>
                            <button onClick={this.allplay}> Play </button>
                            <button onClick={this.videoSync}> Sync </button>
                            <button onClick={() => {
                                ['videoOne', 'videoTwo'].forEach(el => {
                                    this.setVideoFromStartTime(el)
                                })
                            }}> Loop </button>
                        </div>
                        <label htmlFor="allVideoSpeed" className='player__allControls-label'> Video Speed </label>
                        <input
                            type="range"
                            min="10"
                            max="300"
                            defaultValue='100'
                            name='allVideoSpeed'
                            onChange={this.multiVideoSpeedControl}
                            className='player__allControls-slider'/></>}
                    {this.state.overlay && <> <label
                        htmlFor="videoOneOpacity"
                        className='player__one-controls-label'> Video 1 Opacity </label>
                        <input
                            type="range"
                            min="1"
                            max="100"
                            defaultValue='100'
                            name='videoOneOpactiy'
                            id='videoOneOpacity'
                            onChange={this.changeSliderValue}
                            className='player__one-controls-slider'/>
                        <label htmlFor="videoTwoOpacity" className='player__two-controls-label'> Video 2 Opacity </label>
                        <input
                            type="range"
                            min="1"
                            max="100"
                            defaultValue='100'
                            name='videoTwoOpactiy'
                            id='videoTwoOpacity'
                            onChange={this.changeSliderValue}
                            className='player__two-controls-slider'/> </>}
                    <button className='player__allControls-overlay' onClick={this.toggleOverlay}> Overlay </button>
                </div>}
            </>
        )
    }
}
