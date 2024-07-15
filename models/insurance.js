const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const insuranceSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    refPath: 'ownerType',
    required: true
    },
  ownerType: {
    type: String,
    enum: ['User', 'Person'], 
    required: true
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
});

module.exports = mongoose.model('Insurance', insuranceSchema);
