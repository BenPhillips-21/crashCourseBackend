const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const schema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    otherDriver: {
        type: Schema.Types.ObjectId,
        ref: 'Person',
        required: false  
    },
    carRegistrationNumber: {
        type: String,
        required: true,
      },
    insurerCompany: {
        type: String,
        required: true
    },
    insurerContactNumber: {
        type: String,
        required: true
    },
    insurancePolicy: {
        type: String,
        required: true
    },
    insurancePolicyNumber: {
        type: String,
        required: true
    }
})

schema.path('owner').validate(function(value) {
    return this.owner || this.otherDriver
  }, 'Either owner or otherDriver must be provided.')
  
schema.path('otherDriver').validate(function(value) {
    return this.owner || this.otherDriver
  }, 'Either owner or otherDriver must be provided.')

module.exports = mongoose.model('Insurance', schema)