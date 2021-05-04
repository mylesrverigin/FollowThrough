import axios from 'axios'
import Signup from './components/Signup/Signup'
import Login from './components/Login/Login'


// const handleSubmit = (e) => {
//   e.preventDefault()
//   const form = new FormData()
//   form.append('file',e.target.file.files[0])
//   form.append('user','Myles')
//   axios.post('http://localhost:8080/upload',form).then(res=>{
//     console.log(res)
//   }).catch(err=>{console.log(err)})
// }

// let id = 'video2';
// let id2 = 'video3';

function App() {
  return (
    <div>
      {/* <form encType="multipart/form-data" onSubmit={handleSubmit}>
        <input type="file" name='file' />
        <button type="submit">
          send it
        </button>
      </form>
      {id && <video src={`http://localhost:8080/stream0/${id}`} type='video/mp4' id='video' controls></video>}
      {id2 && <video src={`http://localhost:8080/stream0/${id2}`} type='video/mp4' controls></video>} */}
      <Signup />
      <Login />
    </div>
  );
}

export default App;
