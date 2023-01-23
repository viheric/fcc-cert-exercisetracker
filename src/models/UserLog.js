const mongoose = require('mongoose')

const logSchema = new mongoose.Schema({
    "description": { type: String, required: true },
    "duration": { type: Number, required: true },
    "date": { type: Date, default: Date.now() }
})

module.exports = mongoose.model('UserLog', logSchema);