// Modules and Configs
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
require('dotenv').config()
const cors = require('cors')

const webSocket = require('ws')
const wss = new webSocket.Server({port:8080})

const DBconnection = require('./db/db')
const userSchema = require('./models/userModel')

// MiddleWares
app.use(cors())
app.use(express.json())

// JWT
function generateToken(user){
    return jwt.sign(
        {userName: user.name, userId: user.id},
        process.env.chaveSecreta,
        {expiresIn: process.env.tokenDuration}
    )
}

//Routes
    // Get user
    app.post('/userGet', (req,res)=>{
        const userName = req.body.name

        userSchema.findOne({name: userName}).then((user)=>{
            if(user){
                if(user.password == req.body.password){
                    const token = generateToken(user) 
                    res.status(200).send({success: "User sign in gone successful", token: token, tokenDuration: process.env.tokenDuration})
                }else{
                    res.status(400).send({err: "Wrong Informations"})
                }
            }else{
                res.status(400).send({err: "Wrong informations"})
            }
        }).catch((err)=>{
            res.status(500).send({err: "Something went wrong: "+err})
        })
    })

    // Create User
    app.post('/userPost', async (req,res)=>{
        try {
            const user = new userSchema({
                name: req.body.name,
                password: req.body.password
            })

            await user.save()

            res.status(200).send({success: 'User sign up gone success'})
        } catch (error) {
            if(error.code == 11000){
                res.status(400).send({err: 'This user already exists'})
            }else{
                res.status(500).send({err: 'Something went wrong'})
            }
        }
    })

// WS

const users = {}

wss.on('connection', (ws)=>{
    ws.on('message', (msg)=>{
        const data = JSON.parse(msg)

        if(data.type == 'register'){
            users[data.username] = ws
            ws.username = data.username
            console.log(`${data.username} se conectou`)
            return;
        }

        if(data.type == 'privateMessage'){
            const host = users[data.to]
            const origin = ws
            if(!host){
                origin.send(JSON.stringify({err:"Offline user or non-existent"}))
            }else{
                const newMessage = {
                    from: ws.username,
                    to: host.username,
                    msg: data.msg
                }
                host.send(JSON.stringify(newMessage))
                origin.send(JSON.stringify({
                        success:"connection established",
                        connectedTo: host.username
                    }
                ))
            }
        }
    })

    ws.on('close', ()=>{
        if(ws.username){
            delete users[ws.username]
            console.log(`${ws.username} se desconectou`)
        }
    })
})

// Inicialization
app.listen(8081, ()=>{
    DBconnection()
    console.log('Server is running')
})

// codigo para rodar o mongod 
//mongod --dbpath C:\MongoData\data --logpath C:\MongoData\log\mongo.log