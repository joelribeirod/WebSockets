const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    password: String
})

mongoose.model('users', userSchema)

const user = mongoose.model('users')

module.exports = user