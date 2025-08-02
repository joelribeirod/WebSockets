import { useState } from 'react'
import { useNavigate, Link, redirect } from "react-router-dom"

import './SignIn.css'
import LanguageOptions from '../asides/LanguageOptions'

function SignIn(){
    const language = JSON.parse(localStorage.getItem('language') || '{}')?.language || 'br'
    const navigate = useNavigate()
    const urlHTTP = process.env.REACT_APP_URLCONNECTIONHTTP || 'http://localhost:8081'

    const [userName, setUserName] = useState()
    const [userPassword, setUserPassword] = useState()
    const [lang, setLang] = useState(language)

    const textsLang = {
        log:{
            br: 'Logar conta',
            us: 'Log account'
        },
        name:{
            br: 'Seu nome',
            us: 'Your name'
        },
        password:{
            br: 'Sua senha',
            us: 'Your password'
        },
        btn:{
            br: 'Enviar',
            us: 'Send'
        },
        redirect:{
            br: 'Não possui uma conta?',
            us: 'Dont have an account?'
        },
        redirectLink:{
            br: 'Crie uma aqui',
            us: 'Create one here'
        }

    }
    
    function getLang(e){
        setLang(e)
    }

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
                <h1>{textsLang.log[lang]}</h1>

                <div id="infos">
                    <p>{textsLang.name[lang]}</p>
                    <input type='text' maxLength='25' onChange={(e)=>{
                        setUserName(e.target.value)
                    }}/>
                    <p>{textsLang.password[lang]}</p>
                    <input type='password' onChange={(e)=>{
                        setUserPassword(e.target.value)
                    }}/>
                </div>

                <button onClick={logIn}>{textsLang.btn[lang]}</button>
                <p>{textsLang.redirect[lang]} <Link to="/signup">{textsLang.redirectLink[lang]}</Link></p>
            </div>
            <LanguageOptions getLang={getLang}/>
        </div>
    )
}

export default SignIn