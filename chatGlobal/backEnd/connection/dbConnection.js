const mongose = require('mongoose')

const conectarDB = ()=>{
    try{
        mongose.connect(`mongodb://127.0.0.1:27017/chatGlobal`)
        console.log('MongoDB conectado')
    }
    catch(err){
        console.log(err)
    } 
}

module.exports = conectarDB