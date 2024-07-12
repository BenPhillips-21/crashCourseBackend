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
    insurances: [{
        type: Schema.Types.ObjectId,
        ref: 'Insurance',
        required: false     
    }],
    witnesses: [{ 
        type: Schema.Types.ObjectId,
        ref: 'Person',
        required: false  
    }],
})

module.exports = mongoose.model('Accident', schema)