const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
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
  address: {
    type: String,
    required: true,
    minlength: 6
  },
  phoneNumber: {
    type: String,
    required: true,
    minlength: 7
  },
  insuranceDetails: [{ type: Schema.Types.ObjectId, ref: 'Insurance' }],
  accidents: [{ type: Schema.Types.ObjectId, ref: 'Accident' }]
})

module.exports = mongoose.model('User', schema)