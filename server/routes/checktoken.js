const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const UserInfoModel = require('../database/userInfoModel')

const URI = process.env.MONGODB_URI
const JWT_KEY = process.env.DECODE_KEY
const DBConnection = require('../database/connection')


const jwtTokenCheck = (req, res, next) => {
    const authHeader = req.headers.auth;
    // used to screen requests for routes, checks if token exists and can be converted to a valid user id in DB 
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