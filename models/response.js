var mongoose = require('mongoose');

var responseSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: false,
    trim: false
  },
  number: {
    type: String,
    required: true,
    unique: false,
    trim: true
  },
  message: {
    type: String,
    unique: false,
    required: true,
    trim: true
  },
  miaMessage: {
    type: String,
    required: false,
    unique: false,
    trim: true
  }
});

var responseDB = mongoose.model('response', responseSchema);
module.exports = responseDB;
