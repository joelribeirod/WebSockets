// const ws = new WebSocket('ws://localhost:8080')

// const tokenDuration = localStorage.getItem('tokenDuration')
// const token = localStorage.getItem('token').split('.')
// const tokenPayload = JSON.parse(atob(token[1]));

// const enviar = document.getElementById("enviar")
// const inputMsg = document.getElementById("inputMsg")
// const mensagens = document.getElementById('mensagens')

// // if(tokenDuration < Date.now() || tokenDuration == undefined || tokenDuration == null){
// //     localStorage.removeItem('tokenDuration')
// //     localStorage.removeItem('token')
// //     window.location.replace('http://127.0.0.1:5500/frontEnd/signIn.html')
// // }

// ws.onopen = () => {
//     console.log('Conectado ao servidor WebSocket');
// }

// ws.onerror = ()=>{
//     window.alert("Falha ao se conectar com o servidor")
// }

// ws.onclose = (e)=>{
//     if(e.wasClean){
//         console.log("Servidor fechou: "+e.code)
//     }else{
//         window.alert("Conexão caiu inesperadamente")
//     }
// }

// ws.onmessage = (event) => {
//     const respostaRecebida = JSON.parse(event.data)

//     const mensagemQueSeraExibida = document.createElement('p')

//     if(respostaRecebida.userName == tokenPayload.userName){
//         mensagemQueSeraExibida.classList = "mensagem user"
//     }else{
//         mensagemQueSeraExibida.classList = "mensagem outroUser"
//     }
    
//     mensagemQueSeraExibida.textContent = `${respostaRecebida.userName}: ${respostaRecebida.msg}`

//     mensagens.appendChild(mensagemQueSeraExibida)
    
// }

// function enviarResp(){
//     const mensagem = inputMsg.value

//     if(mensagem.length == 0 || mensagem == null || mensagem == undefined) return null;
//     inputMsg.value = ''

//     const pacote = {
//         userName: tokenPayload.userName,
//         msg: mensagem
//     }

//     ws.send(JSON.stringify(pacote))
// }

// enviar.addEventListener("click", ()=>{
//     enviarResp()
// })

// window.addEventListener("keydown", (e)=>{
//     if (e.key === 'Enter') {
//         e.preventDefault()
//         enviarResp()
//     }
// })

const enviar = document.getElementById("enviar")
const inputMsg = document.getElementById("inputMsg")
const mensagens = document.getElementById('mensagens')
const conversas = document.querySelectorAll('.conversa')
const spanClick = document.querySelectorAll('.spanClick')

console.log(conversas,spanClick)

window.addEventListener('click', (e)=>{
    spanClick.forEach((span)=>{
        if(e.target == span && span.textContent != '+'){
            conversas.forEach((conversa)=>{
                if(conversa.id == span.textContent){
                    conversas.forEach((conversa)=>{
                        conversa.style.display = 'none'
                    })
                    conversa.style.display = 'block'
                }
            })
        }else if(e.target == span && span.textContent == '+'){
            conversas.forEach((conversa)=>{
                if(conversa.id != 0){
                    conversa.style.display = 'none'
                }else{
                    conversa.style.display = 'block'
                }
            })
        }
    })
})