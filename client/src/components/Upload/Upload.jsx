import React, { Component } from 'react'
import axios from 'axios'
import captureVideoFrame from 'capture-video-frame'
import './upload-style.scss'

export default class Upload extends Component {

    state = {
        thumbnail : false
    }

    handleUploadSubmit = (event) => {
        // used for submitting the upload form and saving video file
        event.preventDefault()
        const formData = new FormData()
        // video type check here 
        // verify there is a thumnail
        formData.append('file', event.target.file.files[0])
        formData.append('private', event.target.private.value)
        formData.append('owner', this.props.info.id)
        formData.append('thumbnail', this.state.thumbnail.blob)
        formData.append('username', this.props.info.username)
        axios.post('http://localhost:8080/upload', formData, this.props.axiosConfig())
            .then(res => {
                event.target.reset()
            })
            .catch(err => {
                console.log(err)
            })
    }

    checkRequiredValue = () => {
        // checks if we have username and user id props for form submit returns boolean 
        if (!this.props.info.id || !this.props.info.username || !this.props.axiosConfig) {
            return false
        }
        return true
    }

    createPreview = (event) => {
        console.log('new file')
        const upload = event.target.files[0]
        if (!upload) { return }
        this.setState({
            preview: URL.createObjectURL(upload),
            thumbnail: false
        })
    }

    captureThumbnail = () => {
        const video = document.querySelector('#upload-preview')
        const frame = captureVideoFrame('upload-preview','png')
        if (!frame){ return }
        this.setState({
            thumbnail : frame
        })
    }

    render() {
        return (
            <div>
                <form encType="multipart/form-data" id='uploadForm' onSubmit={this.handleUploadSubmit}>
                    <input type="file" name='file' onChange={this.createPreview} />

                    <label htmlFor="private"> Public Video?</label>
                    <input type="radio" name='private' value={true} />
                    <label htmlFor="private"> True </label>
                    <input type="radio" name='private' defaultChecked value={false} />
                    <label htmlFor="private"> False </label>

                    <button type="submit">
                        send it
                    </button>
                </form>
                <button onClick={this.captureThumbnail}> capture thumbnail</button>
                {this.state.thumbnail && <img src={this.state.thumbnail.dataUri} alt=""  className='video-thumbnail'/>}
                {this.state.preview &&
                    <video controls id='upload-preview' src={this.state.preview} className='video-preview'>
                    </video>}
            </div>
        )
    }
}
