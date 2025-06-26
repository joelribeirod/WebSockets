import { useState } from 'react'
import { useNavigate, Link } from "react-router-dom"
import './SignUp.css'

function SignUp(){
    const navigate = useNavigate()

    const [userName, setUserName] = useState()
    const [userPassword, setUserPassword] = useState()

    function creatAcc() {
        if(userName == undefined || userName == null){
            window.alert('Please, insert the info before sending it')
            return;
        }

        if(userPassword == undefined || userPassword == null){
            window.alert('Please, insert the info before sending it')
            return;
        }

        const user = {
            name: userName,
            password: userPassword
        }

        console.log(user)

        let promise = fetch('http://localhost:8081/createUser', {
            method: "POST",
            headers: {
                'Content-Type':'application/json' 
            },
            body: JSON.stringify(user)
        }).then((resp)=>resp.json())

        Promise.resolve(promise).then((resp)=>{
            if(resp.success){
                window.alert('sucesso ao cadastrar usuario')
                navigate('/signin')
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
                    <input type='text' onChange={(e)=>{
                        setUserName(e.target.value)
                    }}/>
                    <p>Sua senha:</p>
                    <input type='password' onChange={(e)=>{
                        setUserPassword(e.target.value)
                    }}/>
                </div>
                
                <button onClick={creatAcc}>Enviar</button>
                <p>Já possui uma conta? <Link to="/#/signin">Logue usando-a</Link></p>
            </div>
        </div>
    )
}

export default SignUp