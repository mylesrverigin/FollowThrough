const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const UserInfoModel = require('../database/userInfoModel')

const URI = 'mongodb://localhost:27017/capstone'
const JWT_KEY = '2502675089'
let connected = false
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    connected = true
})


const jwtTokenCheck = (req, res, next) => {
    const authHeader = req.headers.auth;
    if (!authHeader) { return res.status(403).send('Please Login') }
    jwt.verify(authHeader, JWT_KEY, (err, verified) => {
        if (err) {
            console.log("bad token")
            return res.status(404).send('bad token')
        }
        else {
            UserInfoModel.findOne({ '_id': verified.id }, (findErr, info) => {
                // no user with that token ID
                if (!info) {
                    console.log('no User with that Token')
                    return res.status(404).send('not a Valid account')
                }
                // user with that Token
                else {
                    next()
                }
            })
        }
    })
}

module.exports = jwtTokenCheck;