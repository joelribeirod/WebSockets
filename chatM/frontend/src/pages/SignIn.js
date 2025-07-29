import { useState } from 'react'
import { useNavigate, Link } from "react-router-dom"
import './SignIn.css'

function SignIn(){
    const navigate = useNavigate()
    const urlHTTP = process.env.REACT_APP_URLCONNECTIONHTTP || 'http://localhost:8081'

    const [userName, setUserName] = useState()
    const [userPassword, setUserPassword] = useState()

    function logIn(){
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

        let promise = fetch(`${urlHTTP}/returnUser`, {
            method: "POST",
            headers: {
                'Content-Type':'application/json' 
            },
            body: JSON.stringify(user)
        }).then((resp)=>resp.json())

        Promise.resolve(promise).then((resp)=>{
            if(resp.success){
                localStorage.setItem('token', resp.token)
                localStorage.setItem('tokenDuration', resp.tokenDuration)

                navigate('/chatm')
            }else{
                window.alert(resp.err)
            }
        }).catch((err)=>{
            console.log("Something went wrong: "+err)
        })
    }

    return (
        <div id="signInCentral">
            <div id="form">
                <h1>Logar conta</h1>

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

                <button onClick={logIn}>Enviar</button>
                <p>Não possui uma conta? <Link to="/signup">Crie uma aqui</Link></p>
            </div>
        </div>
    )
}

export default SignIn