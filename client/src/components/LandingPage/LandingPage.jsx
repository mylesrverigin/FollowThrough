import React, { Component } from 'react'
import './landingPage-style.scss'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import VideoQue from '../VideoQue/VideoQue'
import Upload from '../Upload/Upload'
import Logout from '../Logout/Logout'

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
        searchPublic : false
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

    loadVideos = () => {
        let [queryKey,queryValue] = this.state.searchPublic? ['public',true]:['user',this.props.info.id] ;
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

    render () {
        return (
            <div>
                {!this.token && <Redirect to='/login' />}
                <h1>
                    Welcome {this.props.info.username}
                </h1>
                <Logout history={this.props.history}/>
                {this.state.privateVideos && <VideoQue  key='privateVideo' isPublic={false} videoArray={this.state.privateVideos}/>}
                {this.state.publicVideos &&<VideoQue key='publicVideo' isPublic={true} videoArray={this.state.publicVideos}/>}
                <button onClick={this.loadVideos}> test</button>
                <button onClick={this.setPublic}> change public </button>
                <Upload info={this.props.info} axiosConfig={this.returnConfig}/>
            </div>
        )
    }
}
