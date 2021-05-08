const mongoose = require('mongoose')

// Schema
const UserVideosSchema = new mongoose.Schema({
    user:String,
    video:String,
    public:Boolean,
    username: String,
    timestampID:String,
    uploadTime:Number,
    preview: String
});

// Model 
const UserVideoInfo = mongoose.model('userVideoInfo',UserVideosSchema)

// to make info = new UserVideoInfo({info})
// to save info.save()
// search  model.findOne({query},(err,data)=>{})

module.exports = UserVideoInfo;

