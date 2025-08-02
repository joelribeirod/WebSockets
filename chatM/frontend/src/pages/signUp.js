import { useState } from 'react'
import { useNavigate, Link } from "react-router-dom"
import './SignUp.css'
import LanguageOptions from '../asides/LanguageOptions'

function SignUp(){
    const navigate = useNavigate()

    const urlHTTP = process.env.REACT_APP_URLCONNECTIONHTTP || 'http://localhost:8081'
    const language = JSON.parse(localStorage.getItem('language') || '{}')?.language || 'br'

    const [lang, setLang] = useState(language)
    const [userName, setUserName] = useState()
    const [userPassword, setUserPassword] = useState()

    const textsLang = {
        creat:{
            br: 'Criar conta',
            us: 'Create account'
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
            br: 'Já possui uma conta?',
            us: 'Already have an account?'
        },
        redirectLink:{
            br: 'Logue usando-a',
            us: 'Log it here'
        }
    }

    function getLang(e){
        setLang(e)
    }

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
                <h1>{textsLang.creat[lang]}</h1>

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
                
                <button onClick={creatAcc}>{textsLang.btn[lang]}</button>
                <p>{textsLang.redirect[lang]} <Link to="/">{textsLang.redirectLink[lang]}</Link></p>
            </div>
            <LanguageOptions getLang={getLang}/>
        </div>
    )
}

export default SignUp