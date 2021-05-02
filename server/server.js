const express = require('express')
const fs = require('fs')
const app = express()
const cors = require('cors')

app.use(cors())

const PORT = 8080



// async function createListing(client, newListing){
//     const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing);
//     console.log(`New listing created with the following id: ${result.insertedId}`);
// }

class DataManager {
    // This class is used to connect to mongoDB 
    // and create read and write streams 
    constructor(databaseURI) {
        this.client = new mongodb.MongoClient(databaseURI, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    _connectToMongo = async (callback, args) => {
        // opens database connection 
        this.client.connect()
            .then((res) => { callback(res, ...args) })
            .catch((err) => { console.log(err) })
    }

    _connectToDB = (client, DBstring) => {
        // connects to a database from a client connection
        return client.db(DBstring)
    }

    _createBucket = (dbConnection) => {
        // creates a bucket to given dbConnection 
        return new mongodb.GridFSBucket(dbConnection)
    }

    _connectToCollection = (db, collectionStr) => {
        // connects us to a collection from passed in DB 
        return db.collection(collectionStr)
    }

    _uploadCallBack = (client, dbString, fileName, upLoadFilePath) => {
        // This is meant to be passed into _connectToMongo as a callback for
        // an upload stream, it runs everything we need 
        const db = this._connectToDB(client, dbString)
        const bucket = this._createBucket(db)
        const uploadStream = bucket.openUploadStream(fileName)
        const readStream = fs.createReadStream(upLoadFilePath)
        readStream.pipe(uploadStream)
    }

    createUpload = async () => {
        // uploads a file to Mongo Db using read write stream 
        await this._connectToMongo(this._uploadCallBack, ['capstone', 'video2', './testdata/test.mp4'])
        console.log('video Uploaded')
    }

    _streamCallback = (client, dbString, responsePipe) => {
        const db = this._connectToDB(client, dbString)
        this._connectToCollection(db, 'fs.files').findOne({}, (err, video) => {
            const bucket = this._createBucket(db)
            const stream = bucket.openDownloadStreamByName('video2', { start: 0, end: video.length })
            stream.pipe(responsePipe)
        })
    }

    createStream = async (responsePipe) => {
        await this._connectToMongo(this._streamCallback, ['capstone', responsePipe])
        console.log('stream sent')
    }

}

const mongodb = require('mongodb')
const uri = 'mongodb://localhost:27017/capstone'
const mongoose = require('mongoose')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const GridStream = require('gridfs-stream')

const dbConn = mongoose.createConnection(uri, { useUnifiedTopology: true, useNewUrlParser: true });

let stream;

// // how to add data to collection 
// const kittySchema = new mongoose.Schema({
//     name: String
// });
// const Kitten = mongoose.model('Kitten', kittySchema);

// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
//         /// schema 

//         const silence = new Kitten({ name: 'test' });
//         silence.save((err, data) => {
//             console.log(err, data)
// })
//     // kittySchema.methods.speak = function ()
// });
// // Kitten.find((err,kittens)=>{
// //     console.log(kittens)
// // })
// Kitten.find({name:'test'},(err,data)=>{
//     console.log('find',data)
// })

// Kitten.findOne({name:'test'},(err,data)=>{
//     console.log('find',data)
// })
/// queries 
// With a JSON doc
// Person.
//   find({
//     occupation: /host/,
//     'name.last': 'Ghost',
//     age: { $gt: 17, $lt: 66 },
//     likes: { $in: ['vaporizing', 'talking'] }
//   }).
//   limit(10).
//   sort({ occupation: -1 }).
//   select({ name: 1, occupation: 1 }).
//   exec(callback);

// // Using query builder
// Person.
//   find({ occupation: /host/ }).
//   where('name.last').equals('Ghost').
//   where('age').gt(17).lt(66).
//   where('likes').in(['vaporizing', 'talking']).
//   limit(10).
//   sort('-occupation').
//   select('name occupation').
//   exec(callback);

dbConn.once('open', () => {
    // created stream 
    stream = GridStream(dbConn.db, mongoose.mongo)
    stream.collection('fs')
})



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

app.post('/upload', upload.single('file'), (req, res) => {
    // do stuff with file info here 
    console.log(req.body.user)
    res.status(200).json({file:req.file})
    // res.redirect('/')
})

// see all files 
app.get('/info', (req, res) => {
    stream.files.find().toArray((err, files) => {
        // check if files exist 
        return res.status(200).json(files)
    })
})

// specific file 
app.get('/info/:name', (req, res) => {
    stream.files.findOne({ filename: req.params.name }, (err, file) => {
        res.status(200).json(file)
    })
})


app.get('/', (req, res) => {
    // console.log(stream)
    res.sendFile(__dirname + '/testdata/index.html')
})

const videoStream = require('./routes/stream.js')
app.use('/stream0',videoStream)
app.use('/stream1',videoStream)

app.listen(PORT, () => { console.log(`running on ${PORT}`) })