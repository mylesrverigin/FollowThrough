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

const fileCheck = (id) => {
    // checks the video we are trying to get exists 
    return new Promise((resolve,reject)=>{
        gridStream.exist({'_id':id},(err,file)=>{
            if (file){ return resolve(id)}
            else{ return reject()}
        })
    })
}

router.get('/:id', (req, res) => {
    fileCheck(req.params.id).then((id)=>{
        // file exists start stream
        // timestamp query for each video here to see where to start
        console.log('found stream')
        let readStream = gridStream.createReadStream({
            _id: id,
        })
        readStream.pipe(res)
    })
    .catch(()=>{
        res.status(404).send('try again')
    })
})
module.exports = router