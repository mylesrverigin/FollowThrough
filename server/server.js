const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const GridStream = require('gridfs-stream')

// middleware 
app.use(cors())
app.use(express.json())

// dot env 
const PORT = 8080
const uri = 'mongodb://localhost:27017/capstone'

// signup routes
const userAuth = require('./routes/userAuth')
app.use('/user',userAuth)

//storage engine 
const storage = new GridFsStorage({
    url: uri,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            // reject 
            //resolve 
            // rename
            // reject('no type')
            const fileInfo = {
                filename: file.originalname,
                bucketName: 'fs'
            }
            resolve(fileInfo)
        })
    }
})
const upload = multer({ storage })
// upload routes 
app.post('/upload', upload.single('file'), (req, res) => {
    // do stuff with file info here 
    console.log(req.body.user)
    res.status(200).json({file:req.file})
})

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