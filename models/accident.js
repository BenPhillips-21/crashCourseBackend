const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    time: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    speed: {
        type: String,
        required: true
    },
    weatherConditions: {
        type: String,
        required: true
    },
    crashDescription: {
        type: String,
        required: true
    },
    photos: [{ 
        url: {
          type: String,
          unique: true
        },
      }],
    otherVehicles: [{ 
        registrationNumber: {
            type: String,
            required: true,
        },
        make: {
            type: String,
            required: true
        },
        model: {
            type: String,
            required: false
        } 
    }],
    witnesses: [{ 
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        involvement: {
            type: String,
            required: true
        }
    }],
})

module.exports = mongoose.model('Accident', schema)