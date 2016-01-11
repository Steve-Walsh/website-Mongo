    var mongoose = require('mongoose')
    var Schema = mongoose.Schema;
    
    var CommentSchema = new Schema({
        body: { type: String, required: true },
        author: { type: String, required: true },
        upvotes: Number
      });

    var PostSchema = new Schema({
      title: { type: String, required: true },
      link: { type: String, optional: true },
      author: { type: String, required: true },
      comments: [CommentSchema],
      upvotes: Number
    });

    module.exports = mongoose.model('posts', PostSchema);