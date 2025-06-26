const mongoose = require('mongoose')

const db = ()=>{
    try {
        mongoose.connect(`mongodb://127.0.0.1:27017/chatM`)
        console.log('mongoDB connect with success')
    } catch (error) {
        console.log('Error during the connection with mongoDB'+error)
    }
}

module.exports = db