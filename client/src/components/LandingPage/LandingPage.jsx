import React, { Component } from 'react'
import './landingPage-style.scss'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import VideoQue from '../VideoQue/VideoQue'
import Upload from '../Upload/Upload'
import Logout from '../Logout/Logout'
import VideoPlayer from '../VideoPlayer/VideoPlayer'

// this is where everything outside of login and signup will live
// user can look at there videos or other users videos 
// they can start a player from here as well 


export default class LandingPage extends Component {
    token = this.props.info.token
    // axios config needs to be in requests as a header to send our token
    axiosConfig = {}

    state = {
        privateVideos : [],
        publicVideos : [],
        videoOne : '',
        videoTwo : ''
    }
    
    generateConfig = (token) => {
        // generates axios configs with the required header 
        this.axiosConfig = {
            headers: {
                auth: token
            }
        }
    }

    returnConfig = () => {
        return this.axiosConfig
    }

    setPublic = () => {
        this.setState({
            searchPublic : !this.state.searchPublic
        })
    }

    loadVideos = (isPublic) => {
        let [queryKey,queryValue] = isPublic? ['public',true]:['user',this.props.info.id] ;
        let query = {}
        query[queryKey] = queryValue
        axios.post('http://localhost:8080/videoQue',{query},this.axiosConfig)
            .then(res=>{
                // if videos are public or private save them
                let stateKey = queryKey === 'user'? 'privateVideos' : 'publicVideos';
                let updatedState = {}
                updatedState[stateKey] = res.data
                this.setState({...updatedState})
            })
            .catch(err=>{
                console.log(err)
            })
    }
    
    componentDidMount = () => {
        this.generateConfig(this.token)
    }

    setVideo = (videoStr,videoId) => {
        let videoUpdate = {}
        videoUpdate[videoStr] = videoId
        this.setState(videoUpdate)
    }

    render () {
        return (
            <div>
                {!this.token && <Redirect to='/login' />}
                <header>
                    <h2>
                    Welcome {this.props.info.username}
                    </h2>
                    <Logout history={this.props.history}/>
                </header>
                <VideoPlayer video1={this.state.videoOne} video2={this.state.videoTwo}/>
                {this.state.privateVideos && <VideoQue  key='privateVideo' isPublic={false} videoArray={this.state.privateVideos} buttonFunction={this.setVideo}/>}
                {this.state.publicVideos &&<VideoQue key='publicVideo' isPublic={true} videoArray={this.state.publicVideos} buttonFunction={this.setVideo}/>}
                <button onClick={()=>{this.loadVideos(false)}}> Private</button>
                <button onClick={()=>{this.loadVideos(true)}}> Public </button>
                <Upload info={this.props.info} axiosConfig={this.returnConfig}/>
            </div>
        )
    }
}
