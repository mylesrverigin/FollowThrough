import React from 'react'
import './landingPage-style.scss'
import { Redirect } from 'react-router-dom'
import axios from 'axios'

let axiosConfig = {};

const handleSubmit = (event, id) => {
    event.preventDefault()
    const formData = new FormData()
    // video type check here 
    formData.append('file', event.target.file.files[0])
    formData.append('private', event.target.private.value)
    formData.append('owner', id)
    axios.post('http://localhost:8080/upload', formData, axiosConfig)
        .then(res => {
            console.log(res)
        })
        .catch(err => {
            console.log(err)
        })
}

const generateConfig = (token) => {
    return {
        headers: {
            auth: token
        }
    }
}

export default function LandingPage(props) {
    const { id, token, username } = { ...props.props }
    axiosConfig = generateConfig( token )
    return (
        <div>
            {!token && <Redirect to='/login' />}
            <h1>
                Welcome {username}
            </h1>
            <h2>
                Your Videos
            </h2>
            <form encType="multipart/form-data" onSubmit={(event) => { handleSubmit(event, id) }}>
                <input type="file" name='file' />

                <p> Private Video?</p>
                <label htmlFor="private"> True </label>
                <input type="radio" name='private' value={true} defaultChecked />
                <input type="radio" name='private' value={false} />
                <label htmlFor="private"> False </label>
                <button type="submit">
                    Upload File
          </button>
            </form>
        </div>
    )
}
