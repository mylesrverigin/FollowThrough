import axios from 'axios'
import Signup from './components/Signup/Signup'
import Login from './components/Login/Login'
import { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import LandingPage from './components/LandingPage/LandingPage'

class App extends Component {
  // load profile info in user has token saved 
  state = {
    id: "",
    joined: 0,
    prostatus: false,
    token: localStorage.getItem('followThrouhgAuth') || "",
    username: ""
  }

  updateLogin = (data) => {
    localStorage.setItem('followThrouhgAuth', data.token)
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
      .catch(err => { console.log(err) })
  }

  componentDidMount = () => {
    if (this.state.token !== '') {
      this.fetchProfile(this.state.token)
    }
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route path='/' exact render={(routerProps) => { return <LandingPage props={this.state} /> }} />
            <Route path='/login' render={(routerProps) => { return <Login updateLogin={this.updateLogin} history={routerProps.history} /> }} />
            <Route path='/signup' render={(routerProps) => { return <Signup updateLogin={this.updateLogin} history={routerProps.history} /> }} />
          </Switch>
          {/* <form encType="multipart/form-data" onSubmit={handleSubmit}>
          <input type="file" name='file' />
          <button type="submit">
            send it
          </button>
        </form>
        {id && <video src={`http://localhost:8080/stream0/${id}`} type='video/mp4' id='video' controls></video>}
        {id2 && <video src={`http://localhost:8080/stream0/${id2}`} type='video/mp4' controls></video>} */}
          {/* <Signup /> */}
        </div>
      </BrowserRouter>
    )
  }
}

export default App;
