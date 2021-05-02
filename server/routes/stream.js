const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const GridStream = require('gridfs-stream');

const uri = 'mongodb://localhost:27017/capstone'

let gridStream;

const conn = mongoose.createConnection(uri, { useUnifiedTopology: true, useNewUrlParser: true });
conn.once('open', function () {
    gridStream = GridStream(conn.db, mongoose.mongo);
})

const fileCheck = (name) => {
    return new Promise((resolve,reject)=>{
        gridStream.files.find({ 'filename': name }).toArray((err, files) => {
            // check if files exist 
            if (files.length > 0){resolve(true)}
            else{ reject(false)}
        })
    })
}

router.get('/:name', (req, res) => {
    fileCheck(req.params.name).then(()=>{
        // file exists start stream
        let readStream = gridStream.createReadStream({
            filename: req.params.name
        })
        readStream.pipe(res)
    })
    .catch(()=>{
        res.status(404).send('try again')
    })
})
module.exports = router