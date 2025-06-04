const mongose = require ('mongoose')

const userSchema = new mongose.Schema({
    name: {type: String, required: true, unique: true},
    password: String
})

mongose.model('users', userSchema)

const user = mongose.model('users')

module.exports = user