const ws = new WebSocket('ws://localhost:8080')

const enviar = document.getElementById("enviar")
const inputMsg = document.getElementById("inputMsg")
const mensagens = document.getElementById('mensagens')
const divSpanClicks = document.getElementById('divSpanClicks')
const addConversation = document.getElementById('0')

let globalVariableLastMessage

const tokenDuration = localStorage.getItem('tokenDuration')
const token = localStorage.getItem('token').split('.')
const tokenPayload = JSON.parse(atob(token[1]));

if(tokenDuration < Date.now() || tokenDuration == undefined || tokenDuration == null){
    localStorage.removeItem('tokenDuration')
    localStorage.removeItem('token')
    window.location.reload('http://localhost:5500/chatPrivado/frontEnd/signIn.html')
}

ws.onopen = () => {
    ws.send(JSON.stringify({
        type:'register',
        username:tokenPayload.userName
    }))
}

ws.onerror = ()=>{
    window.alert("Falha ao se conectar com o servidor")
}

ws.onclose = (e)=>{
    if(e.wasClean){
        console.log("Servidor fechou: "+e.code)
    }else{
        window.alert("Conexão caiu inesperadamente")
    }
}
// função que observa quando o servidor envia uma mensagem
ws.onmessage = (event) => {
    const respostaRecebida = JSON.parse(event.data)

    // If the server returned an error, it'll be showed to the user    
    if(respostaRecebida.err){
        window.alert(respostaRecebida.err)
        return null
    }

    // Caso a primeira conexão que foi estabelecidade foi o proprio usuario
    if(respostaRecebida.success){
        // Resgata o nome do destinatario e analisa se ja existe uma conversa com ele
        const userName = respostaRecebida.connectedTo
        console.log("Conexão estabelecida")

        const divsMessages = document.querySelectorAll('.conversas')
        let foundConversation

        divsMessages.forEach((divMessage)=>{
            if(divMessage.id == userName){
                foundConversation = divMessage
            }
        })

        // if doesn't have a conversation, it creats a new one
        if(!foundConversation){
            let spanClick = document.createElement('span')
            spanClick.classList = 'spanClick'
            spanClick.textContent = respostaRecebida.connectedTo
            divSpanClicks.appendChild(spanClick)

            let divConversation = document.createElement('div')
            divConversation.classList = 'conversas'
            divConversation.id = respostaRecebida.connectedTo
            divConversation.style.display = 'flex'

            let message = document.createElement('p')
            message.classList = "mensagem user"
            message.textContent = globalVariableLastMessage
            
            divConversation.appendChild(message)
            mensagens.appendChild(divConversation)
            addConversation.style.display = 'none'
        }else{
            // if already exists a conversation, it only insert the new message
            let message = document.createElement('p')
            message.classList = "mensagem user"
            message.textContent = globalVariableLastMessage

            foundConversation.appendChild(message)
        }
    }else{
    // Caso a primeira conexão com o usuario foi feito por outro usuario
        // Get the name of the origin person and analyzes if already exist a conversation
        const userName = respostaRecebida.from
        const divsMessages = document.querySelectorAll('.conversas')
        let foundConversation

        divsMessages.forEach((divMessage)=>{
            if(divMessage.id == userName){
                foundConversation = divMessage
            }
        })

        // If exists a conversation, only insert the message
        if(foundConversation){
            let message = document.createElement('p')
            message.classList = "mensagem outroUser"
            message.textContent = respostaRecebida.msg

            foundConversation.appendChild(message)
        }else{
            // If doesn't exist a conversation, it creats a new one
            let spanClick = document.createElement('span')
            spanClick.classList = 'spanClick'
            spanClick.textContent = respostaRecebida.from
            divSpanClicks.appendChild(spanClick)

            let divConversation = document.createElement('div')
            divConversation.classList = 'conversas'
            divConversation.id = respostaRecebida.from
            divConversation.style.display = 'none'

            let message = document.createElement('p')
            message.classList = "mensagem outroUser"
            message.textContent = respostaRecebida.msg

            divConversation.appendChild(message)
            mensagens.appendChild(divConversation)
        }
    }
}
// Função que resgata um valor e envia ao servidor
function enviarResp(){
    const text = inputMsg.value.split(" ")
    const addConversation = document.getElementById('0')

    // identifica se o usuario está conversando diretamente com alguem ou adicionando nova conversa
    if(addConversation.style.display == 'flex'){
        const userName = text[0]
        if(userName[0] != '/'){
            // Analyzes if the user typed the correct form of the comand to add a conversation
            window.alert('Please, insert a correct syntax')
        }else{
            // Get the message
                text.shift()
                const msg = text.join(" ")

                if(msg.length == 0 || msg == null || msg == undefined){
                    window.alert("Envie uma mensagem")
                    return null
                }
            //
            inputMsg.value = ''

            // Get the user name
                let removingSlash = userName.split("")
                removingSlash.shift()
                let userNameFormatted = removingSlash.join("")
            //
            // Creat the package
                const package = {
                    type: 'privateMessage',
                    to: userNameFormatted,
                    msg: msg
                }
            //
            // Change the value of the global variable and send the package to the server
            globalVariableLastMessage = msg
            ws.send(JSON.stringify(package))
            //
        }
    }else{
        // Get all conversations divs, the value of the input (the message)
            const divsMessages = document.querySelectorAll('.conversas')
            const msg = inputMsg.value
            let divUser
        //
        // Get what conversation is open
            divsMessages.forEach((conversa)=>{
                if(conversa.style.display == 'flex'){
                    divUser = conversa
                }
            })
        //
        // Get the user name of that conversation and see if the message is a valid message
            const userName = divUser.id
            if(msg.length == 0 || msg == null || msg == undefined){
                return null
            }
        //
        // Creat the package and clean the input
            const package = {
                type: 'privateMessage',
                to: userName,
                msg: msg
            }
            inputMsg.value = ''
        //
        // Change the value of the global variable and send the package to the server
            globalVariableLastMessage = msg
            ws.send(JSON.stringify(package))
        //
    }
}

// Observa quando o usuario quer enviar uma mensage
enviar.addEventListener("click", ()=>{
    enviarResp()
})

window.addEventListener("keydown", (e)=>{
    if (e.key === 'Enter') {
        e.preventDefault()
        enviarResp()
    }
})

// For now just know that, this eventListener open and close conversations
window.addEventListener('click', (e)=>{
    const divsMessages = document.querySelectorAll('.conversas')
    const spansClicks = document.querySelectorAll('.spanClick')

    spansClicks.forEach((span)=>{
        if(e.target == span && span.textContent != '+'){
            divsMessages.forEach((conversa)=>{
                if(conversa.id == span.textContent){
                    divsMessages.forEach((conversa)=>{
                        conversa.style.display = 'none'
                    })
                    conversa.style.display = 'flex'
                }
            })
        }else if(e.target == span && span.textContent == '+'){
            divsMessages.forEach((conversa)=>{
                if(conversa.id != 0){
                    conversa.style.display = 'none'
                }else{
                    conversa.style.display = 'flex'
                }
            })
        }
    })
})