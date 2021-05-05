const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const GridStream = require('gridfs-stream')
const tokenCheck = require('./routes/checktoken')

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

/// create streaming connection 
const dbConn = mongoose.createConnection(uri, { useUnifiedTopology: true, useNewUrlParser: true });
let stream;
dbConn.once('open', () => {
    // created stream 
    stream = GridStream(dbConn.db, mongoose.mongo)
    stream.collection('fs')
})
// streaming routes 
const videoStream = require('./routes/stream.js')
app.use('/stream0',videoStream)
app.use('/stream1',videoStream)

app.listen(PORT, () => { console.log(`running on ${PORT}`) })