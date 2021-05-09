import axios from 'axios'
import Signup from './components/Signup/Signup'
import Login from './components/Login/Login'
import { Component } from 'react'
import { Route, Switch, withRouter} from 'react-router-dom'
import LandingPage from './components/LandingPage/LandingPage'
import './app.scss'

// this is the level all user info will live and be handed down into other components 

class App extends Component {
  // load profile info in user has token saved 
  state = {
    id: "",
    joined: 0,
    prostatus: false,
    token: localStorage.getItem('followThroughAuth') || "",
    username: ""
  }

  updateLogin = (data) => {
    localStorage.setItem('followThroughAuth', data.token)
    this.setState({
      ...data
    })
  }

  fetchProfile = (token) => {
    axios.post('http://localhost:8080/user/getprofile', { token })
      .then(profile => {
        this.setState({
          ...profile.data
        })
      })
      .catch(err => {
        console.log('Fetch Info Failed')
        this.props.history.push('/login')
      })
  }

  componentDidMount = () => {
    if (this.state.token !== '') {
      this.fetchProfile(this.state.token)
    }
  }

  render() {
    return (
        <div>
          <Switch>
            <Route path='/' exact render={(routerProps) => { return <LandingPage info={this.state} {...routerProps}/> }} />
            <Route path='/login' render={(routerProps) => { return <Login updateLogin={this.updateLogin} history={routerProps.history} /> }} />
            <Route path='/signup' render={(routerProps) => { return <Signup updateLogin={this.updateLogin} history={routerProps.history} /> }} />
          </Switch>
        </div>
    )
  }
}

export default withRouter(App);
