import React, { Component } from 'react'
import './landingPage-style.scss'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import VideoQue from '../VideoQue/VideoQue'
import Upload from '../Upload/Upload'
import Logout from '../Logout/Logout'
import VideoPlayer from '../VideoPlayer/VideoPlayer'
import LoadMore from '../LoadMore/LoadMore'

// this is where everything outside of login and signup will live
// user can look at their videos or other users videos 
// they can start a player from here as well 


export default class LandingPage extends Component {
    token = this.props.info.token
    // axios config needs to be in requests as a header to send our token
    axiosConfig = {}

    state = {
        privateVideos : null,
        publicVideos : null,
        publicMenuOpen : false,
        privateMenuOpen : true,
        uploadMenuOpen : false,
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

    updateState = (key,value) => {
        let update = {}
        update[key] = value
        this.setState(update)
    }

    loadVideos = (isPublic) => {
        let [queryKey,queryValue] = isPublic? ['public',true]:['user',this.props.info.id] ;
        let query = {}
        query[queryKey] = queryValue
        axios.post(`${this.props.ROUTE}/videoQue`,{query},this.axiosConfig)
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
        this.loadVideos(true)
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
                <header className='header'>
                    <h2 className='header__text'>
                    Welcome {this.props.info.username}
                    </h2>
                    <Logout history={this.props.history}/>
                </header>
                <VideoPlayer video1={this.state.videoOne} video2={this.state.videoTwo} ROUTE={this.props.ROUTE}/>

                {!this.state.privateVideos && <LoadMore 
                                                content='your Videos' 
                                                handler={this.loadVideos}/>}
                {this.state.privateVideos && <VideoQue  
                                                key='privateVideo' 
                                                isPublic={false} 
                                                videoArray={this.state.privateVideos} 
                                                buttonFunction={this.setVideo}
                                                menuOpen={this.state.privateMenuOpen}
                                                closeMenu={this.updateState}
                                                ROUTE={this.props.ROUTE}/>}
                {this.state.publicVideos &&<VideoQue 
                                                key='publicVideo' 
                                                isPublic={true} 
                                                videoArray={this.state.publicVideos} 
                                                buttonFunction={this.setVideo}
                                                menuOpen={this.state.publicMenuOpen}
                                                closeMenu={this.updateState}
                                                ROUTE={this.props.ROUTE}/>}
                
                <Upload 
                    info={this.props.info} 
                    axiosConfig={this.returnConfig}
                    menuOpen={this.state.uploadMenuOpen}
                    closeMenu={this.updateState}
                    ROUTE={this.props.ROUTE}
                    />
            </div>
        )
    }
}
