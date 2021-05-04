const mongoose = require('mongoose')

// Schema
const userInfoSchema = new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    userID:String,
    isPro:Boolean,
    dateJoined:Number
});

// Model 
const userInfoModel = mongoose.model('userProfile',userInfoSchema)

module.exports = userInfoModel;