const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const path = require('path')

// middleware 
app.use(cors())
app.use(express.json())

// dot env 
const PORT = process.env.PORT || 8080

// signup routes
const userAuth = require('./routes/userAuth')
app.use('/user',userAuth)

// test route 
app.get('/',(req,res)=>{
    res.status(200).send('Hello from the API')
})

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

if (process.env.NODE_ENV !== 'production'){
    console.log(path.join(__dirname, '../client/build/index.html'))
    app.use(express.static(path.join(__dirname,'../client/build')))

    app.get('*', (req,res)=>{
        res.redirect(path.join(__dirname, '../client/build/index.html'))
    })
}

app.listen(PORT, () => { console.log(`running on ${PORT}`) })