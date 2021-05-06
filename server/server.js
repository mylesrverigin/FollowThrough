const express = require('express')
const app = express()
const cors = require('cors')

// middleware 
app.use(cors())
app.use(express.json())

// dot env 
const PORT = 8080
const uri = 'mongodb://localhost:27017/capstone'

// signup routes
const userAuth = require('./routes/userAuth')
app.use('/user',userAuth)

// upload routes
const upload = require('./routes/upload')
app.use('/upload',upload)

// video que routes 
const loadQue = require('./routes/loadQue')
app.use('/videoQue',loadQue)

// streaming routes 
const videoStream = require('./routes/stream.js')
app.use('/stream',videoStream)
app.use('/streamAlt',videoStream)

app.listen(PORT, () => { console.log(`running on ${PORT}`) })