const mongoose = require('mongoose')
const log = require('./UserLog')

const userSchema = new mongoose.Schema({
    "username": { type: String, required: true },
    "count": Number,
    "log": [{ type: log.schema, default: () => ({}) }]
})

module.exports = mongoose.model('User', userSchema);