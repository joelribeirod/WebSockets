const express = require("express")
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const User = require('./models/usuario')
const conectarDB = require('./connection/dbConnection')

// Middlewares
    app.use(cors())
    app.use(express.json())

// JWT
    function generateToken(user){
        return jwt.sign(
            {userId: user.id},
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
        if(senhaDoBanco == null || senhaDoBanco == undefined){
            return "Comparação impossivel, hash não é valido"
        }

        const compare = await bcrypt.compare(userPassWord, dbPassWord)

        if(compare){
            return true
        }else return false
    }
//

// Rotas User

app.post('/userPost', async (req,res)=>{
    const hashedPassWord = await generateHash(req.body.senha)

    try {
        const user = new User({
            name: req.body.nome,
            password: hashedPassWord
        })

        await user.save()

        res.send({success: "user sign up with success"})
    } catch (err) {
        if (err.code === 11000){
            res.status(400).send({err: "This user already exists"})
        }else{
            res.status(400).send({unknowErr: "Something went wrong"})
        }
    }
})

app.post('/userGet', (req,res)=>{
    const userName = req.body.name
    User.find({name: userName}).then( async (user)=>{
        if(user){
            const compare = await compareHash(req.body.password, user.senha)

            if(compare){
                const token = generateToken(user)
                res.send({success:true, token: token, tokenDuration: process.env.tokenDuration})
            }
        }else{
            res.send({err: "Incorrect informations"})
        }
    })
})


app.listen(8081, () => {
    conectarDB()
    console.log('Servidor rodando na porta 8081');
});