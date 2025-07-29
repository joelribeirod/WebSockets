import { useState } from 'react'
import { useNavigate, Link } from "react-router-dom"
import './SignUp.css'

function SignUp(){
    const navigate = useNavigate()

    const urlHTTP = process.env.REACT_APP_URLCONNECTIONHTTP || 'http://localhost:8081'

    const [userName, setUserName] = useState()
    const [userPassword, setUserPassword] = useState()

    function creatAcc() {
        if(userName === undefined || userName === null){
            window.alert('Please, insert the info before sending it')
            return;
        }

        if(userPassword === undefined || userPassword === null){
            window.alert('Please, insert the info before sending it')
            return;
        }

        if(userName.length > 25){
            window.alert('Please, insert a name with less than 25 characters')
            return;
        }

        const user = {
            name: userName,
            password: userPassword
        }

        console.log(user)

        let promise = fetch(`${urlHTTP}/createUser`, {
            method: "POST",
            headers: {
                'Content-Type':'application/json' 
            },
            body: JSON.stringify(user)
        }).then((resp)=>resp.json())

        Promise.resolve(promise).then((resp)=>{
            if(resp.success){
                window.alert('sucesso ao cadastrar usuario')
                navigate('/')
            }else{
                console.log(resp)
            }
        }).catch((err)=>{
            console.log("Something went wrong: "+err)
        })
    }

    return (
        <div id="signUpCentral">
            <div id="form">
                <h1>Criar conta</h1>

                <div id="infos">
                    <p>Seu nome:</p>
                    <input type='text' maxLength='25' onChange={(e)=>{
                        setUserName(e.target.value)
                    }}/>
                    <p>Sua senha:</p>
                    <input type='password' onChange={(e)=>{
                        setUserPassword(e.target.value)
                    }}/>
                </div>
                
                <button onClick={creatAcc}>Enviar</button>
                <p>Já possui uma conta? <Link to="/">Logue usando-a</Link></p>
            </div>
        </div>
    )
}

export default SignUp