var mongoose = require('mongoose');

var ErrorSchema = new mongoose.Schema({
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
  }
  // error: {
  //   type: String,
  //   required: true,
  //   unique: false,
  //   trim: true
  // },
  //  autoMessage: {
  //    type: String,
  //    required: true,
  //    unique: false,
  //    trim: true
  //  }
});

var ErrorDB = mongoose.model('error', ErrorSchema);
module.exports = ErrorDB;
