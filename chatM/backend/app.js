const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const cors = require('cors')
const WebScoket = require('ws')
const wss = new WebScoket.Server({port:8080})

const db = require('./dbConnection/db')
const userSchema = require('./models/user')

require('dotenv').config()
app.use(cors())
app.use(express.json())

function generateToken(user){
    return jwt.sign(
        {userName: user.name},
        process.env.chaveSecreta,
        {expiresIn: process.env.tokenDuration}
    )
}

app.post('/returnUser', (req,res)=>{
    const userName = req.body.name

    userSchema.findOne({name: userName}).then((user)=>{
        if(user){
            if(user.password == req.body.password){
                const token = generateToken(user)

                res.status(200).send({
                    success: "User found",
                    token: token, 
                    tokenDuration: process.env.tokenDuration
                })
            }else{
                res.status(400).send({err: 'Incorrect user informations'})
            }
        }else{
            res.status(400).send({err: 'Incorrect user informations'})
        }
    }).catch((err)=>{
        res.status(500).send({err: `Something went wrong: ${err}`})
    })
})

app.post('/createUser', (req,res)=>{
    if(req.body.name == undefined || req.body.name == null){
        res.status(400).send({err: 'Incorrect sintax of the informations'})
        return;
    }

    if(req.body.password == undefined || req.body.password == null){
        res.status(400).send({err: 'Incorrect sintax of the informations'})
        return;
    }

    try {
        const user = new userSchema({
            name: req.body.name,
            password: req.body.password
        })

        user.save()

        res.status(200).send({success: 'User registered with success'})
    } catch (err) {
        if(err.code == 11000){
            res.status(400).send({err: 'This user already exists'})
        }else{
            res.status(500).send({err: `Something went wrong: ${err}`})
        }
    }
})

// WebSockets
const users = {}

wss.on('connection', (ws,req)=>{
    ws.on("message", (msg)=> {
        const data = JSON.parse(msg)

        if(data.type == 'private_message'){
            const host = users[data.to]
            const origin = ws

            if(!host){
                ws.send(JSON.stringify({err: "Offline user or non-existent"}))
            }else{
                const messagePackage = {
                    from: ws.username,
                    to: data.to,
                    msg: data.message
                }

                host.send(JSON.stringify(messagePackage))
                origin.send(JSON.stringify({
                    success: "Message sent with success",
                    connectedTo: data.to
                }))
            }
        }

        if(data.type == 'global_message'){
            // Necessário mais testes
            console.log(data)

            if(!wss.clients) return;

            const globalMessage = {
                from: ws.username,
                msg: data.message
            }

            wss.clients.forEach(client => {
                if(client.readyState === client.OPEN){
                    client.send(JSON.stringify(globalMessage))
                }
            })
        }

        if(data.type == 'register'){
            users[data.username] = ws
            ws.username = data.username
            console.log(`${data.username} se conectou`)
            return;
        }
    })

	ws.on("error", (ws, err) => {
        ws.send(JSON.stringify({err: `Something went wrong: ${err}`}))
    })

    ws.on('close', ()=>{
        if(ws.username){
            delete users[ws.username]
            console.log(`${ws.username} se desconectou`)
        }
    })
})


app.listen(8081, ()=>{
    db()
    console.log('server is running')
})