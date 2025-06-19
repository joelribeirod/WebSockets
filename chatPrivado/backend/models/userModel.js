const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})

mongoose.model('users', userSchema)

const user = mongoose.model('users')

module.exports = user