const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const cors = require('cors')

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
                console.log(token)
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
    console.log(req.body)
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


app.listen(8081, ()=>{
    db()
    console.log('server is running')
})