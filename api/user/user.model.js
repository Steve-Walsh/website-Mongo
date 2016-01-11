var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var UserSchema = new Schema({
      name: { type: String, required: true } ,
      email: { type: String, required: true } ,
      password: { type: String, required: true },
      gender: {type:String , 
      enum: ['Male', 'Female'],
      optional: true },
      phone_num : {type: String, optional : true}


    });

module.exports = mongoose.model('users', UserSchema);

// var PostSchema = new Schema({
//       title: { type: String, required: true },
//       link: { type: String, optional: true },
//       username: { type: String, required: true },
//       comments: [CommentSchema],
//       upvotes: Number
//     });

// module.exports = mongoose.model('posts', PostSchema);