const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const schema = new Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 2
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2
  },
  phoneNumber: {
    type: String,
    required: true,
    minlength: 7
  },
  involvement: {
    type: String,
    required: true,
  }
})

module.exports = mongoose.model('Person', schema)