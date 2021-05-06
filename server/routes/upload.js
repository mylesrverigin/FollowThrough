const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const GridFsStorage = require('multer-gridfs-storage')
const multer = require('multer')

const jwtTokenCheck = require('./checktoken')
const URI = 'mongodb://localhost:27017/capstone'


//storage engine 
const storage = new GridFsStorage({
    url: URI,
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

// mongo connection and data models 
const UserVideoModel = require('../database/userVideoModel')
let connected = false
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    connected = true
})

router.post('/',jwtTokenCheck,upload.single('file'),(req,res)=>{
    // upload video route, checks if user has a valid token and then stores the video 
    // needs a video owner ID and makes sure there is a video being uploaded  
    // makes a record to refence video ID attaching owner ID, date created and if its public 
    const videoId = req.file ? req.file.id : null
    const { private, owner, username } = req.body

    if ( !connected ){ return res.status(500).send('No DB connection')}
    if ( !videoId || !owner ){ 
        return res.status(400).send('Incorrect Details for Video Record')
    }

    const videoRecord = new UserVideoModel({
        user : owner,
        video : videoId,
        public : private,
        username : username,
        timestampID : '', 
        uploadTime : Date.now()
    })
    videoRecord.save((saveErr, success)=>{
        if (saveErr){ res.status(500).send('error Saving File')}
        res.status(200).json(success)
    })
})

module.exports = router