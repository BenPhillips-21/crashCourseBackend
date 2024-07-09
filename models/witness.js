const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const schema = new Schema({
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
})

module.exports = mongoose.model('Witness', schema)