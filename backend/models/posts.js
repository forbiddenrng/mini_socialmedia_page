const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  ownerId: {
    type: String,
    required: true,
  },
  createDate: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  modifyDate: {
    type: String,
    default: null,
  }
})
module.exports = mongoose.model('Post', PostSchema, 'posts')