const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const schema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
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
})

module.exports = mongoose.model('Insurance', schema)