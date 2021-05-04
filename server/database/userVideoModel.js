const mongoose = require('mongoose')

// Schema
const UserVideosSchema = new mongoose.Schema({
    user:String,
    video:String,
    public:Boolean,
    timestampID:String
});

// Model 
const UserVideoInfo = mongoose.model('userVideoInfo',UserVideosSchema)

// to make info = new UserVideoInfo({info})
// to save info.save()
// search  model.findOne({query},(err,data)=>{})

module.exports = UserVideoInfo;


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
