const mongoose = require('mongoose')

const db = (url)=>{
    try {
        mongoose.connect(url)
        console.log('mongoDB connect with success')
    } catch (error) {
        console.log('Error during the connection with mongoDB'+error)
    }
}

module.exports = db