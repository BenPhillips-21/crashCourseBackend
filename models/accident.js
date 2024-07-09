const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const schema = new Schema({
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
          default: "",
        },
      }],
    otherVehicles: [{ type: Schema.Types.ObjectId, ref: 'Vehicle' }],
    witnesses: [{ type: Schema.Types.ObjectId, ref: 'Witness' }],
})

module.exports = mongoose.model('Accident', schema)