const mongoose = require('mongoose')

const DBconnection = ()=>{
    mongoose.connect('mongodb://127.0.0.1:27017/privateChat').then(()=>{
        console.log('DB is running')
    }).catch((err)=>{
        console.log(`Something went wrong on running the DB: ${err}`)
    })
}

module.exports = DBconnection