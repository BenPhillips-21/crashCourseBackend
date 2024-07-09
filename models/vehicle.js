const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const schema = new Schema({
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
})

module.exports = mongoose.model('Vehicle', schema)