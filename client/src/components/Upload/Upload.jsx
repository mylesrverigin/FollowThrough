import React, { Component } from 'react'
import axios from 'axios'
import captureVideoFrame from 'capture-video-frame'
import './upload-style.scss'
import LoadMore from '../LoadMore/LoadMore'

export default class Upload extends Component {

    state = {
        thumbnail: false,
        preview: false,
        success: false
    }

    handleUploadSubmit = (event) => {
        // used for submitting the upload form and saving video file
        event.preventDefault()
        const formData = new FormData()
        // video type check here 
        // verify there is a thumnail
        if (!this.state.thumbnail){ return alert('Select a thumbnail before upload')}
        formData.append('file', event.target.file.files[0])
        formData.append('private', event.target.private.value)
        formData.append('owner', this.props.info.id)
        formData.append('thumbnail', this.state.thumbnail.blob)
        formData.append('username', this.props.info.username)
        axios.post(`${this.props.ROUTE}/upload`, formData, this.props.axiosConfig())
            .then(res => {
                event.target.reset()
                this.setState({
                    thumbnail: false,
                    preview: false,
                    success: true
                })
                this.props.forceUpdate()
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
        const frame = captureVideoFrame('upload-preview', 'png')
        if (!frame) { return }
        this.setState({
            thumbnail: frame
        })
    }

    render() {
        return (
            <>
                <LoadMore content='Upload Video' handler={() => { this.props.closeMenu('uploadMenuOpen', !this.props.menuOpen) }} />
                <div className={`upload ${this.props.menuOpen ? '' : 'hidden'}`}>
                    <form encType="multipart/form-data" id='uploadForm' className='upload__form' onSubmit={this.handleUploadSubmit}>
                        <div className='upload__form-input-container'>
                            <input type="file" name='file' onChange={this.createPreview} className='upload__form-input' />
                            <button> Upload </button>
                        </div>

                        <div>
                            <label htmlFor="private" className='upload__form-label'> Public Video?</label>
                            <input type="radio" name='private' value={true} className='upload__form-radio' />
                            <label htmlFor="private" className='upload__form-label'> True </label>
                            <input type="radio" name='private' defaultChecked value={false} className='upload__form-radio' />
                            <label htmlFor="private" className='upload__form-label'> False </label>
                        </div>

                        <button type="submit" className='upload__form-button'>
                            send it
                    </button>
                        <div className='upload__preview-container'>
                            {this.state.thumbnail && <img src={this.state.thumbnail.dataUri} alt="" className='upload__thumbnail' />}
                            {this.state.preview &&
                                <video controls muted id='upload-preview' src={this.state.preview} className='upload__preview'>
                                </video>}
                        </div>
                        <button type='button' onClick={this.captureThumbnail} className='upload__button'> capture thumbnail</button>
                    </form>
                    {this.state.success && <h2 className='upload-success'> Upload Success</h2>}
                </div>
            </>
        )
    }
}
