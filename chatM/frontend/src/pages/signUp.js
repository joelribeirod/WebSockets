import Input from "../asides/Input"
import './SignUp.css'

function SignUp(){
    return (
        <div id="signUpCentral">
            <div id="form">
                <h1>Criar conta</h1>
                <Input text='Seu nome' type='text'/>
                <Input text='Sua senha' type='password'/>
                <button>Enviar</button>
                <p>Já possui uma conta? <a href="/#/signin">Logue usando-a</a></p>
            </div>
        </div>
    )
}

export default SignUp