import React, { Component } from 'react'
import axios from 'axios';
import './signup-style.scss'
import { Link } from 'react-router-dom'
// This is the signup form for all new accounts


export default class Signup extends Component {
    updateLogin = this.props.updateLogin
    history = this.props.history

    state = {
        signupForm:{
            user:'',
            userEmail:'',
            passwordInit:'',
            passwordVerify:''
        }
    }

    handleInputChange = (event) => {
        let update = {}
        update[event.target.name] = event.target.value
        this.setState({
            signupForm:{...this.state.signupForm,...update}
        })
    }

    handleSubmit = (event) => {
        event.preventDefault()
        // verify user pw and email
        axios.post('http://localhost:8080/user/signup',this.state.signupForm)
        .then(res=>{
            this.updateLogin(res.data)
            this.history.push('/')
        })
        .catch(err=>{
            console.log(err)
        })
    }

    render() {
        const bem = 'signup'
        const { user, userEmail } = {...this.state.signupForm}
        return (
            <div>
                <form className={`${bem}__form`} autoComplete='off' onChange={this.handleInputChange} onSubmit={this.handleSubmit}>

                    <input type="text" name='user' className={`${bem}__form-input`} defaultValue={user} placeholder='User Name'/>
                    <label htmlFor="user" className={`${bem}__form-label`}> User Name </label>

                    <input type="email" name="userEmail" className={`${bem}__form-input`} defaultValue={userEmail} placeholder='Email'/>
                    <label htmlFor="userEmail" className={`${bem}__form-label`}> Recovery Email </label>

                    <input type="password" name='passwordInit' className={`${bem}__form-input`} placeholder='Password'/>
                    <label htmlFor="passwordIniti" className={`${bem}__form-label`}> Desired Password </label>

                    <input type="password" name='passwordVerify' className={`${bem}__form-input`} placeholder='Retype Password'/>
                    <label htmlFor="passwordVerify" className={`${bem}__form-label`}> Verify Password </label>

                    <button type='submit' className={`${bem}__form-button`}> Sign up</button>
                </form>
                <Link to='/login'> Already A Member?</Link>
            </div>
        )
    }
}
