const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const cors = require('cors')
const WebScoket = require('ws')
const wss = new WebScoket.Server({port:8080})

const db = require('./dbConnection/db')
const userSchema = require('./models/user')

// MiddleWares
    require('dotenv').config()
    app.use(cors())
    app.use(express.json())

// Token JWT
function generateToken(user){
    return jwt.sign(
        {userName: user.name},
        process.env.chaveSecreta,
        {expiresIn: process.env.tokenDuration}
    )
}

// Routes
    // Route to return a user
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

    // Route to create a user
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
    // Storage all online users
    const users = {}
    
    // Establishes the connection
    wss.on('connection', (ws,req)=>{
        // When someone send a message
        ws.on("message", (msg)=> {
            // Turn the message in json type
            const data = JSON.parse(msg)

            // Analyses the type of the message
            // private_message, global_message or register 

            // If is a priavate message, it sends to who the origin wants
            if(data.type == 'private_message'){
                const host = users[data.to]
                const origin = ws

                // If the user aren't online, send a error, else send the message of success to origin, and the message for the host (user on the other side)
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

            // If its a global message, it sends it to everyone that is online
            if(data.type == 'global_message'){
                if(!wss.clients) return;

                const globalMessage = {
                    global: 'global_message',
                    from: ws.username,
                    msg: data.message
                }

                wss.clients.forEach(client => {
                    if(client.readyState === client.OPEN){
                        client.send(JSON.stringify(globalMessage))
                    }
                })
            }

            // If its a register message, it registers the user on the server, and sends to everyone that one more user connected on the server (sends the number of everyone registered)
            if(data.type == 'register'){
                users[data.username] = ws
                ws.username = data.username

                console.log(`${ws.username} se conectou`)

                if(!wss.clients) return;

                const usersCounteur = {
                    counteur: 'counteur',
                    msg: Object.keys(users).length
                }

                wss.clients.forEach(client => {
                    if(client.readyState === client.OPEN){
                        client.send(JSON.stringify(usersCounteur))
                    }
                })
            }
        })

        // If happens one error during the connection, the server sends it
        ws.on("error", (ws, err) => {
            ws.send(JSON.stringify({err: `Something went wrong: ${err}`}))
        })

        // If someone disconnect from the server, it unregister the user, and sends to everyone that the user disconnect (sends the number of everyone registered)
        ws.on('close', ()=>{
            if(ws.username){
                delete users[ws.username]
                console.log(`${ws.username} se desconectou`)
            }

            if(!wss.clients) return;

            const usersCounteur = {
                counteur: 'counteur',
                msg: Object.keys(users).length
            }

            wss.clients.forEach(client => {
                if(client.readyState === client.OPEN){
                    client.send(JSON.stringify(usersCounteur))
                }
            })
        })
    })

// Start the server
app.listen(8081, ()=>{
    db()
    console.log('server is running')
})