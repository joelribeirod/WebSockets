import { useEffect, useRef, useState } from 'react'
import './ChatM.css'

function ChatM(){
    const ws = useRef(null)

    useEffect(()=>{
        const token = localStorage.getItem('token').split('.')
        const tokenPayload = JSON.parse(atob(token[1]));

        ws.current = new WebSocket('ws://localhost:8080')

        ws.current.onopen = () => {
            ws.current.send(JSON.stringify({
                type:'register',
                username:tokenPayload.userName
            }))
        }

        ws.current.onmessage = (e)=>{
            const data = JSON.parse(e.data)

            console.log(data)
        }

        ws.current.onclose = (e)=>{
            if(e.wasClean){
                console.log("Servidor fechou: "+e.code)
            }else{
                window.alert("Conexão caiu inesperadamente")
            }
        }

        ws.current.onerror = ()=>{
            window.alert("Falha ao se conectar com o servidor")
        }
    },[])

    const [message, setMessage] = useState('')

    function sendMessage(){
        const divSelected = document.querySelector('.on').id

        console.log(divSelected)

        if(message.length === 0 || message === undefined || message === null){
            return null
        }

        const verifyIfHaveName = message.split(" ")[0]

        let name = verifyIfHaveName.slice(1)
        let removingName = message.split(" ").slice(1)
        let joiningTheMessage = removingName.join(" ")
        
        // Analise se o usuario enviou uma mensagem com o codigo para criar nova conversa, e faz a conexão com o novo usuario
        if(verifyIfHaveName[0] === '/'){
            const userPackage = {
                to: name,
                message: joiningTheMessage,
                type: 'private_message'
            }

            ws.current.send(JSON.stringify(userPackage))
        }else if(divSelected !== 'globalChat'){
            // Analisa se o usuario está conversando com alguem através de um chat privado, e envia a mensagem priva
            let userMessage = message

            const userPackage = {
                to: divSelected,
                message: userMessage,
                type: 'private_message'
            }

            ws.current.send(JSON.stringify(userPackage))
        }else {
            // Se nenhuma das alternativas anteriores foram correspondidas, significa que o usuario está enviando uma mensagem publica, e é oq o codigo abaixo faz
            let userMessage = message

            const userPackage = {
                message: userMessage,
                type: 'global_message'
            }

            ws.current.send(JSON.stringify(userPackage))
        }
    }

    return (
        <div id="chatPage">
            <h1>Chat M</h1>
            <div id="chat">
                <div id='changeConversations' onClick={(e)=>{
                    if(e.target.id !== 'changeConversations'){
                        // console.log(e.target.id)
                    }

                    const divSelected = e.target.id

                    const divsConversation = document.querySelectorAll('.conversation')

                    divsConversation.forEach((div)=>{
                        if(div.id !== divSelected){
                            div.className = 'conversation off'
                        }else{
                            div.className = 'conversation on'
                        }
                    })
                }}>
                    <span id='globalChat' className="material-symbols-outlined">globe</span>

                    {/* Spans para testes */}
                    <span id='Fulano' className='setConversation'>Fulano</span>
                    <span id='ciclano' className='setConversation'>ciclano</span>
                    <span id='beltrano' className='setConversation'>beltrano</span>
                </div>
                <div id="conversations">
                    <div id='globalChat' className='conversation on'>
                        <p className='rulesAndInfos'>Use /user to iniciate a private conversation</p>
                        <p className='rulesAndInfos'>Be polite with others, and hf</p>
                    </div>

                    {/* Divs para testes */}
                    <div id='Fulano' className='conversation off'>
                        <p className='mensagem'>Fulano: Salve</p>
                    </div>
                    <div id='ciclano' className='conversation off'>
                        <p className='mensagem'>ciclaco: Salve</p>
                    </div>
                    <div id='beltrano' className='conversation off'>
                        <p className='mensagem'>beltrano: Salve</p>
                    </div>

                </div>
                <div id="interactivity">
                    <input type='text' placeholder='Send your message' onChange={(e)=>{
                        setMessage(e.target.value)
                    }}/>
                    <span className="material-symbols-outlined" onClick={sendMessage}>send</span>
                </div>
            </div>
        </div>
    )
}

export default ChatM