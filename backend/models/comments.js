const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  postId:{
    type: String,
    required: true
  },
  ownerId: {
    type: String,
    required: true,
  }, 
  content: {
    type: String,
    required: true,
  }, 
  createDate: {
    type: String,
    required: true,
  }, 
  editDate: {
    type: String,
    default: null
  }
})

module.exports = mongoose.model('Comment', CommentSchema, "comments")