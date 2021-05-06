import React, { Component } from 'react'
import axios from 'axios'

export default class Upload extends Component {

    handleUploadSubmit = (event) => {
        // used for submitting the upload form and saving video file
        event.preventDefault()
        const formData = new FormData()
        // video type check here 
        formData.append('file', event.target.file.files[0])
        formData.append('private', event.target.private.value)
        formData.append('owner', this.props.info.id)
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
        if (!this.props.info.id || !this.props.info.username || !this.props.axiosConfig){
            return false
        }
        return true
    }

    render() {
        return (
            <div>
                <form encType="multipart/form-data" id='uploadForm' onSubmit={this.handleUploadSubmit}>
                    <input type="file" name='file' />

                    <label htmlFor="private"> Public Video?</label>
                    <input type="radio" name='private' value={true}/>
                    <label htmlFor="private"> True </label>
                    <input type="radio" name='private' defaultChecked value={false}/>
                    <label htmlFor="private"> False </label>

                    <button type="submit">
                        send it
                    </button>
                </form>
            </div>
        )
    }
}
