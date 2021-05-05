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
    const videoId = req.file ? req.file.id : null
    const { private, owner } = req.body

    if ( !connected ){ return res.status(500).send('No DB connection')}
    if ( !videoId || !owner ){ 
        return res.status(400).send('Incorrect Details for Video Record')
    }

    const videoRecord = new UserVideoModel({
        user : owner,
        video : videoId,
        public : private,
        timestampID : '', 
        uploadTime : Date.now()
    })
    videoRecord.save()
        .then( success => {
            return res.status(200).json(success)
        })
        .catch( saveError => {
            console.log(saveError)
            return res.status(500).send('Error Saving')
        })
})

module.exports = router