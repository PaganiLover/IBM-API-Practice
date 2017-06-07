var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var MessageSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: false,
    trim: true
  },
  number: {
      type: String,
      unique: false,
      required: true,
      trim: true
    },
    message: {
      type: String,
      unique: false,
      required: true,
      trim: true
    },
    answer: {
      type: String,
      unique: false,
      required: true,
      trim: true
    }
});

var Message = mongoose.model('Message', MessageSchema);
module.exports = Message;
