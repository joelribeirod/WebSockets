import { useEffect, useRef, useState } from 'react'
import './ChatM.css'
import Span from '../asides/Span'
import DivConversation from '../asides/DivConversation'

function ChatM(){
    const ws = useRef(null)
    const dataForTheSpansRef = useRef(null)
    const dataForTheDivsRef = useRef(null)
    const refForMessages = useRef(null)

    const [activatedDiv, setActivatedDiv] = useState({})
    const [dataForTheSpans, setDataForTheSpans] = useState([])
    const [dataForTheDivs, setDataForTheDivs] = useState([])

    const [message, setMessage] = useState('')

    useEffect(()=>{
        dataForTheSpansRef.current = dataForTheSpans
    }, [dataForTheSpans])
    
    useEffect(()=>{
        dataForTheDivsRef.current = dataForTheDivs
    }, [dataForTheDivs])

    useEffect(()=>{
        refForMessages.current = message
    }, [message])

    useEffect(()=>{
        console.log(dataForTheDivs)
    }, [dataForTheDivs])

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

            // const userOrigin = data.from

            // analyzes who sent a message
            if(data.to){
                console.log(data)
            }

            // analyzes if the message was sent with success
            if(data.success){
                const userHost = data.connectedTo

                // search for the user
                let findUser = dataForTheSpansRef.current.find(user => user.userName === userHost)

                console.log(data)

                // remove the user name and get only the message
                let removingName = refForMessages.current.split(" ").slice(1)
                let joiningTheMessage = removingName.join(" ")

                // analyzes if has a conversation, else create a new one
                if(findUser){
                    let newMessage = {sender: 'origin', message: joiningTheMessage}

                    // Search for the conversation, and add the new message
                    setDataForTheDivs(prev => prev.map((user)=>(
                        user.userName === findUser.userName ? {...user, messages: [...user.messages, newMessage]} : user
                    )))

                    console.log(dataForTheDivsRef.current) 
                }else{
                    setDataForTheSpans(prev => [...prev, {userName: userHost}])
                    setDataForTheDivs(prev => [...prev, {
                        userName: userHost, 
                        messages: [
                            {
                                sender: 'origin',
                                message: joiningTheMessage
                            }
                        ]
                    }])
                }

            }else if(data.err){
                window.alert(data.err)
            }
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

    function sendMessage(){
        const divSelected = document.querySelector('.on').id

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
                    if(e.target.id === 'changeConversations'){
                        return;
                    }

                    const divSelected = e.target.id
                    setActivatedDiv({user: divSelected, class:'on'})

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

                    {/* Creates spans for change the conversations */}
                    {dataForTheSpans.map((dado)=>(
                        <Span key={dado.userName} userId={dado.userName} userName={dado.userName}/>
                    ))}
                </div>
                <div id="conversations">
                    <div id='globalChat' className='conversation on'>
                        <p className='rulesAndInfos'>Use /user to iniciate a private conversation</p>
                        <p className='rulesAndInfos'>Be polite with others, and hf</p>
                    </div>

                    {/* Creates divs to see the conversations */}
                    {dataForTheDivs && dataForTheDivs.map((divData)=>(
                       
                        <DivConversation 
                            userName={divData.userName} 
                            className='conversation off'
                            messages={divData.messages}
                        />
                        
                    ))}

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