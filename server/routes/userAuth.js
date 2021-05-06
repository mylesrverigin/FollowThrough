const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

// JWT 
const JWT_DECODE_KEY = '2502675089'

const newJwtToken = (info, key = JWT_DECODE_KEY) => {
    return jwt.sign(info, key);
}

const decodeJwtToken = (token, key = JWT_DECODE_KEY) => {
    return jwt.verify(token, key)
}

// mongoose schema 
const UserInfoModel = require('../database/userInfoModel')
// db connection add to .env 
const URI = 'mongodb://localhost:27017/capstone'
let connected = false
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    connected = true
})

router.post('/signup', (req, res) => {
    // Creates a new account in the DB based on info sent in the body tag 
    if (!connected) { return res.status(500).send('DataBase not Connected') }
    // verify info sent
    // verify account doesn't exist
    const userSignupInfo = req.body
    const newUserProfile = new UserInfoModel({
        username: userSignupInfo.user,
        email: userSignupInfo.userEmail,
        password: userSignupInfo.passwordInit,
        isPro: false,
        dateJoined: Date.now()
    })
    newUserProfile.save().then(profile => {
        const newToken = newJwtToken({ id: profile._id })
        return res.status(200).json({
            id: profile._id,
            username: profile.username,
            prostatus: profile.isPro,
            joined: profile.dateJoined,
            token: newToken
        })
    })
        .catch(saveError => {
            console.log(saveError)
            return res.status(500).send('Error Saving profile')
        })

})

router.post('/login', (req, res) => {
    // Checks login credentials and returns a JWT token along with basic account info on success
    if (!connected) { return res.status(500).send('DataBase not Connected') }
    const info = req.body
    UserInfoModel.findOne({}).or([{ 'username': info.user }, { 'email': info.user }]).exec()
        .then(profile => {
            if (!profile) {
                return res.status(400).send('User Not Found')
            } else {
                if (profile.password === info.password) {
                    // set global decoder for key 
                    const newToken = newJwtToken({ id: profile._id })
                    return res.status(200).json({
                        id: profile._id,
                        username: profile.username,
                        prostatus: profile.isPro,
                        joined: profile.dateJoined,
                        token: newToken
                    })
                }
                else {
                    return res.status(400).send('Invalid Password')
                }
            }
        })
        .catch(finderr => {
            console.log(finderr)
        })
})

router.post('/getprofile', (req, res) => {
    // when a user logs in with a token existing this route will fetch the rest of the users details 
    const token = req.body.token
    if (!token) { return res.status(404).send('invalid') }
    const decodedInfo = decodeJwtToken(token)
    if (!decodedInfo) { return res.status(404).send('Invalid Token') }
    UserInfoModel.findOne({ '_id': decodedInfo.id }, (searchError, profile) => {
        if (searchError || !profile) { return res.status(404).send('cant find user') }
        return res.status(200).json({
            id: profile._id,
            username: profile.username,
            prostatus: profile.isPro,
            joined: profile.dateJoined,
            token: token
        })
    })
})

module.exports = router