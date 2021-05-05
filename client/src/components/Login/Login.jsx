import React, { Component } from 'react'
import './login-style.scss'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default class Login extends Component {
    updateLogin = this.props.updateLogin
    history = this.props.history

    state = {
        formData : {
            user : '',
            password : ''
        }
    }

    handleChange = (event) => {
        let update = {}
        update[event.target.name] = event.target.value
        this.setState({
            formData:{...this.state.formData,...update}
        })
    }

    handleSubmit = (event) => {
        // verify login structure 
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwOTA2ZjkzZmNiZDgzNDEwOGRiNDZmMCIsImlhdCI6MTYyMDE1MTA0Mn0.f0H3JsB-iIYk8qn48AA5wYob1yTiIPYCuaDKLTzSHYY"

        event.preventDefault()
        axios.post('http://localhost:8080/user/login',this.state.formData,{'headers':{'auth':token}})
            .then(res=>{
                // verify status 200
                this.updateLogin(res.data)
                this.history.push('/')
            })
            .catch(err=>{
                console.log(err)
            })
    }

    render() {
        const bem = 'login'
        return (
            <div>
                <form className={`${bem}__form`} onChange={this.handleChange} onSubmit={this.handleSubmit}>

                    <input type="text" name='user' placeholder='Username or Email' className={`${bem}__form-input`}/>
                    <label htmlFor="user" className={`${bem}__form-label`}>
                        Username or Email
                    </label>

                    <input type="password" name='password' placeholder='Password' className={`${bem}__form-input`}/>
                    <label htmlFor="password" className={`${bem}__form-label`}>
                        Password
                    </label>

                    <button type='submit' className={`${bem}__form-submit`}>
                        Login
                    </button>
                </form>
                <Link to='/signup'> Sign Up Here </Link>
            </div>
        )
    }
}
