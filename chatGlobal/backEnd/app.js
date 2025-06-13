const express = require("express")
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const WebScoket = require('ws')
const wss = new WebScoket.Server({port:8080})
require('dotenv').config()

const User = require('./models/usuario')
const conectarDB = require('./connection/dbConnection')

// Middlewares
    app.use(cors())
    app.use(express.json())

// JWT
    function generateToken(user){
        return jwt.sign(
            {userId: user.id, userName: user.name},
            process.env.chaveSecreta,
            {expiresIn: process.env.tokenDuration}
        )
    }
// Bcrypt
    async function generateHash(password){
        const hashedPassWord = await bcrypt.hash(password, 10)
        return hashedPassWord
    }

    async function compareHash(userPassWord, dbPassWord){
        if(dbPassWord == null || dbPassWord == undefined){
            return "Imposible compare, this hash isn't valid"
        }

        const compare = await bcrypt.compare(userPassWord, dbPassWord)

        if(compare){
            return 'Igual'
        }else {
            return 'Diferente'
        }
    }
//

// Rotas User
    //criar usuario
    app.post('/userPost', async (req,res)=>{
        const hashedPassWord = await generateHash(req.body.passWord)

        console.log(req.body)

        try {
            const user = new User({
                name: req.body.name,
                password: hashedPassWord
            })

            await user.save()

            res.send({success: "user sign up with success"})
        } catch (err) {
            if (err.code === 11000){
                res.status(400).send({err: "This user already exists"})
            }else{
                res.status(400).send({unknowErr: "Something went wrong" + err})
            }
        }
    })
    // resgatar usuario
    app.post('/userGet', (req,res)=>{
        const userName = req.body.name

        console.log(req.body)

        User.find({name: userName}).then( async (user)=>{
            if(user){
                const compare = await compareHash(req.body.passWord, user[0].password)
                
                if(compare == 'Igual'){
                    const token = generateToken(user[0])
                    res.send({success:true, token: token, tokenDuration: process.env.tokenDuration})
                }else{
                    res.send({err: 'Incorrect informations'})
                }
            }else{
                res.send({err: "Incorrect informations"})
            }
        }).catch((err)=>{
            res.send({err: err})
        })
    })

// WebScoket
function broadCast(wss, jsonObject){
    if(!wss.clients) return;
    wss.clients.forEach(client => {
        if(client.readyState === client.OPEN){
            client.send(JSON.stringify(jsonObject))
        }
    })
}

function onMessage(ws, data){
    const pacote = JSON.parse(data)
	broadCast(wss, pacote) 
    console.log(pacote)  
}

function onError(ws, err){
	ws.send("Ouve um erro: "+err)
}

function Connection(ws, req){
    console.log("Usuário se conectou")
    ws.on("message", data => onMessage(ws, data))
	ws.on("error", err => onError(ws, err))
}

wss.on('connection', Connection)
wss.broadcast = broadCast

// Inicializar servidor

app.listen(8081, () => {
    conectarDB()
    console.log('Servidor rodando na porta 8081');
});