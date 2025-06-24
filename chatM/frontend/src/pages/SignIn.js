import Input from "../asides/Input"
import './SignIn.css'

function SignIn(){
    return (
        <div id="signInCentral">
            <div id="form">
                <h1>Logar conta</h1>
                <Input text='Seu nome:' type='text'/>
                <Input text='Sua senha:' type='password'/>
                <button>Enviar</button>
                <p>Não possui uma conta? <a href="/#/signup">Crie uma aqui</a></p>
            </div>
        </div>
    )
}

export default SignIn