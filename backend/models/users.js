const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  email:{
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  city: {
    type: String,
    default: ""
  },
  favGenre: {
    type: String,
    default: ""
  },
  instrument: {
    type: String,
    default: ""
  },
  info: {
    type: String,
    default: ""
  }
})
module.exports = mongoose.model('User', userSchema, 'users')