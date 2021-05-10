const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const jwtTokenCheck = require('./checktoken')

// db connection 
const URI = process.env.MONGODB_URI
let connected = false
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    connected = true
})

// db model 
const UserVideoModel = require('../database/userVideoModel');

// todo filter out the current users videos when requesting 
router.post('/',jwtTokenCheck,(req,res)=> {
    let {query} = req.body
    if (!connected){return res.status(500).send('DB not connected')}
    if (!query){return res.status(404).send('malformed Query')}
    // validate query 
    UserVideoModel.find(query,(err,results)=> {
        if (err){ return res.status(404).send('couldnt find anything')}
        res.status(200).json(results)
    })
})

module.exports = router