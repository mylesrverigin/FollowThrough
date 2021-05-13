import React, { Component } from 'react'
import './login-style.scss'
import axios from 'axios'
import { Link } from 'react-router-dom'
// This is whre the User Logins in and gets a token from 


export default class Login extends Component {
    updateLogin = this.props.updateLogin
    history = this.props.history

    state = {
        formData: {
            user: '',
            password: ''
        }
    }

    handleChange = (event) => {
        let update = {}
        update[event.target.name] = event.target.value
        this.setState({
            formData: { ...this.state.formData, ...update }
        })
    }

    handleSubmit = (event) => {
        // verify login structure 
        event.preventDefault()
        console.log(this.props.ROUTE)
        axios.post(`${this.props.ROUTE}/user/login`, this.state.formData)
            .then(res => {
                // verify status 200
                this.updateLogin(res.data)
                this.history.push('/')
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        const bem = 'login'
        return (
            <div className={bem}>
                <form className={`${bem}__form`} onChange={this.handleChange} onSubmit={this.handleSubmit}>

                    <label htmlFor="user" className={`${bem}__form-label`}>
                        Username or Email
                    </label>
                    <input type="text" name='user' placeholder='Username or Email' className={`${bem}__form-input`} />

                    <label htmlFor="password" className={`${bem}__form-label`}>
                        Password
                    </label>
                    <input type="password" name='password' placeholder='Password' className={`${bem}__form-input`} />

                    <button type='submit' className={`${bem}__form-submit`}>
                        Login
                    </button>
                </form>
                <Link to='/signup'>
                    <h3 className={`${bem}__signup`} > Sign Up Here </h3>
                </Link>
            </div>
        )
    }
}
