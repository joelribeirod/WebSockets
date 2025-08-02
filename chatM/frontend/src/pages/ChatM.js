import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate} from "react-router-dom"
import './ChatM.css'
import Span from '../asides/Span'
import DivConversation from '../asides/DivConversation'
import LanguageOptions from '../asides/LanguageOptions'

function ChatM(){
    const ws = useRef(null)
    const wsConnection = process.env.REACT_APP_URLCONNECTIONWS || 'ws://localhost:8081'
    const language = JSON.parse(localStorage.getItem('language')).language

    const dataForTheSpansRef = useRef(null)
    const dataForTheDivsRef = useRef(null)
    const refForMessages = useRef(null)
    const refForActivatedDiv = useRef(null)
    const refForInputThatSendMessage = useRef(null)
    
    const [lang, setLang] = useState(language)
    const [activatedDiv, setActivatedDiv] = useState([])
    const [userCounteur, setUserCounteur] = useState(0)
    const [charactersCounter, setCharactersCounter] = useState(0)
    const [dataForTheSpans, setDataForTheSpans] = useState([])
    const [dataForTheDivs, setDataForTheDivs] = useState([])
    const [dataForGlobalMessages, setDataForGlobalMessages] = useState([])

    const [message, setMessage] = useState('')

    const navigate = useNavigate()

    // Function to close the WebSocket connection
    function closeWS(){
        ws.current.close(1000, 'encerrando a conexão')
        localStorage.removeItem('token')
        localStorage.removeItem('tokenDuration')
        navigate('/')
    }
    
    // Function to get the user name from the JWT token
    function getUserName(){
        const token = localStorage.getItem('token').split('.')
        const tokenPayload = JSON.parse(atob(token[1]));

        return tokenPayload.userName
    }

    // Ps: This code needed a lot of reference because most of the code was create inside a useEffect, without changing it, so, if wasn't used the references, the code will try to use the default values, ignoring the news ones// 

    // Analyzes if the user has a token of if the token still valid
    useEffect(()=>{
        const token = localStorage.getItem('token')
        const tokenDuration = localStorage.getItem('tokenDuration')
        if(!token){
            navigate('/')
        }

        if(Number(tokenDuration) + Date.now() < Date.now()){
            localStorage.removeItem('token')
            localStorage.removeItem('tokenDuration')
            navigate('/')            
        } 
    })

    // Creates the reference for the spans data
    useEffect(()=>{
        dataForTheSpansRef.current = dataForTheSpans
    }, [dataForTheSpans])
    
    // Creates the reference for the divs data
    useEffect(()=>{
        dataForTheDivsRef.current = dataForTheDivs
    }, [dataForTheDivs])

    // Creates the reference for the messages
    useEffect(()=>{
        refForMessages.current = message
    }, [message])

    // get the div of the global message, and put on the State activatedDiv, for doesn't bug the div scroll
    useEffect(()=>{
        let divGlobalDefault = document.querySelector('#conversations #globalChat')
        setActivatedDiv(divGlobalDefault)
    }, [])

    // Below the useEffect for setting the global message div, this is used for creating a reference for it
    useEffect(()=>{
        refForActivatedDiv.current = activatedDiv
    }, [activatedDiv])

    // When a data changes, the reference for activatedDiv ensures that the scroll of the div that the user are typing will stay on bottom
    useEffect(()=>{
        refForActivatedDiv.current.scrollTop = refForActivatedDiv.current.scrollHeight
    }, [dataForTheDivs, dataForGlobalMessages])
    
    // useEffect for creating the connection with the Web Socket
    useEffect(()=>{
        const userName = getUserName()

        ws.current = new WebSocket(wsConnection)

        // When opens the connection, the client sends a register message
        ws.current.onopen = () => {
            ws.current.send(JSON.stringify({
                type:'register',
                username: userName
            }))
        }

        // When the client recieve a message
        ws.current.onmessage = (e)=>{
            const data = JSON.parse(e.data)

            // analyzes who sent a message
            if(data.to){
                const userHost = data.from

                let findUser = dataForTheSpansRef.current.find(user => user.userName === userHost)

                // If the user exists on the data, it only will increase the data with the new data
                // Else, it creates the data for this new user
                if(findUser){
                    let newMessage = {
                        sender: 'host', 
                        message: data.msg
                    }

                    setDataForTheDivs(prev => prev.map((user)=>(
                        user.userName === findUser.userName ? {...user, messages: [...user.messages, newMessage]} : user
                    )))

                }else{
                    setDataForTheSpans(prev => [...prev, {userName: userHost}])
                    setDataForTheDivs(prev => [...prev, {
                        userName: userHost, 
                        messages: [
                            {
                                sender: 'host',
                                message: data.msg
                            }
                        ]
                    }])
                }
            }

            // analyzes if the message was sent with success
            if(data.success){
                const userHost = data.connectedTo

                // search for the user
                let findUser = dataForTheSpansRef.current.find(user => user.userName === userHost)

                // remove the user name and get only the message
                let messageSent
                if(refForMessages.current[0] === '/'){
                    let removingName = refForMessages.current.split(" ").slice(1)
                    let joiningTheMessage = removingName.join(" ")

                    messageSent = joiningTheMessage
                }else{
                    messageSent = refForMessages.current
                }
                

                // analyzes if has a conversation, else create a new one
                console.log(refForMessages)
                if(findUser){
                    let newMessage = {
                        sender: 'origin', 
                        message: messageSent
                    }

                    // Search for the conversation, and add the new message
                    setDataForTheDivs(prev => prev.map((user)=>(
                        user.userName === findUser.userName ? {...user, messages: [...user.messages, newMessage]} : user
                    )))

                }else{
                    setDataForTheSpans(prev => [...prev, {userName: userHost}])
                    setDataForTheDivs(prev => [...prev, {
                        userName: userHost, 
                        messages: [
                            {
                                sender: 'origin',
                                message: messageSent
                            }
                        ]
                    }])
                }
                // clear the input message after sending a message
                setMessage('')
            }

            // analyzes if is a global message
            if(data.global){
                let newMessage

                // if who sent the message is our user, it change the field 'whoSent', its useful 'cause we can control the css classes
                // Else, the field 'whoSent' stays with host (user on the other side)
                if(data.from === getUserName()){
                    newMessage = {
                        whoSent: 'origin',
                        from: data.from,
                        message: data.msg
                    }
                }else{
                    newMessage = {
                        whoSent: 'host',
                        from: data.from,
                        message: data.msg
                    }
                }
                
                // Update the data and clear the input message
                setDataForGlobalMessages(prev => [...prev, newMessage])
            }

            // If the server message is a counter, it update the userCounter with the recent number
            if(data.counteur){
                setUserCounteur(data.msg)
            }
            
            // If happened a error, it shows for the user
            if(data.err){
                window.alert(data.err)
            }
        }

        // If the server closed, the client-side shows to the user
        ws.current.onclose = (e)=>{
            if(e.wasClean){
                console.log("Server closed: "+e.code)
            }else{
                console.log("Something went wrong with our server, we are trying to reconnect with it")

                ws.current.send(JSON.stringify({
                    type:'register',
                    username: userName
                }))
                // Provavelmente isso ainda não está funcionando, pois essa callback executada quando a conexão fecha, e do jeito que está, ela informa no console que fechou e tentar mandar uma mensagem, mas n sei se tem como mandar uma mensagem se a conexão fechou
            }
        }

        // If the connection goes wrong
        ws.current.onerror = ()=>{
            window.alert("Failure when connection with the server, try reload your page")
        }
    },[wsConnection])

    // Function for when a user try to send a message
    const sendMessage = useCallback(()=>{
        // Get the div that the user are typing
        const divSelected = document.querySelector('.on').id

        // Analyses if isn't a null message
        if(message.length === 0 || message === undefined || message === null){
            return null
        }

        if(message.length > 1024){
            window.alert('Input limit exceeded, limit 1024 characters')
            return;
        }

        // Separete the name of the message
        const verifyIfHaveName = message.split(" ")[0]
        let name = verifyIfHaveName.slice(1)
        let removingName = message.split(" ").slice(1)
        let joiningTheMessage = removingName.join(" ")

        // Analyze if the user is trying to send a message to himself
        const user = getUserName()
        if(name === user){
            return;
        }
        
        // analyzes if the user send a message with the code to initiate a new conversation, and creates it
        if(verifyIfHaveName[0] === '/'){
            const userPackage = {
                to: name,
                message: joiningTheMessage,
                type: 'private_message'
            }

            ws.current.send(JSON.stringify(userPackage))
        }else if(divSelected !== 'globalChat'){
            // Analyzes if the user are trying to conversate private with someone
            let userMessage = message

            const userPackage = {
                to: divSelected,
                message: userMessage,
                type: 'private_message'
            }

            ws.current.send(JSON.stringify(userPackage))
        }else {
            // If none of the later alternatives was true, means that the user are trying to send a global message, and it does so
            let userMessage = message

            const userPackage = {
                message: userMessage,
                type: 'global_message'
            }

            ws.current.send(JSON.stringify(userPackage))
        }
        //Clear the Character Counter after sending a message
        setCharactersCounter(0)
    },[message])

    useEffect(()=>{
        function analysesIfHasFocus(e){
            if(e.key === 'Enter'){
                if(document.activeElement === refForInputThatSendMessage.current){
                    sendMessage()
                }else{
                    refForInputThatSendMessage.current.focus()
                }
            }
        }

        window.addEventListener('keydown', analysesIfHasFocus)

        return ()=>{
            window.removeEventListener('keydown', analysesIfHasFocus)
        }
        
    },[sendMessage])

    const textsLang = {
        user:{
            br: 'Usuário',
            us: 'User'
        },
        ruleAndInfo1:{
            br: 'Use /nomeDeUsuário para iniciar uma conversa privada.',
            us: 'Use /userName to iniciate a private conversation.'
        },
        ruleAndInfo2:{
            br: 'Seja educado com os outros, e se divirta.',
            us: 'Be polite with others, and hf.'
        },
        userCount:{
            br: 'Usuários online:',
            us: 'Online Users:'
        },
        inputPlaceHolder:{
            br: 'Enviar sua mensagem',
            us: 'Send your message'
        }
    }

    function getLang(e){
        setLang(e)
    }

    return (
        <div id="chatPage">
            <h1>Chat M</h1>

            <div id='userInfo'>
                <button id="logOut" onClick={()=>(closeWS())}>
                    <span className="material-symbols-outlined">logout</span>
                </button>
                <h1>{textsLang.user[lang]} {getUserName()}</h1>
            </div>

            <div id="chat">
                {/* Where the spans stay */}
                <div id='changeConversations' onClick={(e)=>{
                    if(e.target.id === 'changeConversations'){
                        return;
                    }

                    const divSelected = e.target.id
                    setActivatedDiv(e.target)

                    const divsConversation = document.querySelectorAll('.conversation')

                    divsConversation.forEach((div)=>{
                        if(div.id !== divSelected){
                            div.className = 'conversation off'
                        }else{
                            setActivatedDiv(div)
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

                {/* Where the div for each conversation stay */}
                <div id="conversations">
                    <div id='globalChat' className='conversation on'>
                        <p className='rulesAndInfos'>{textsLang.ruleAndInfo1[lang]}</p>
                        <p className='rulesAndInfos'>{textsLang.ruleAndInfo2[lang]}</p>
                        <hr/>
                        {dataForGlobalMessages && dataForGlobalMessages.map((message, index)=>(
                            <p key={index} className={message.whoSent}>{message.from}: {message.message}</p>
                        ))}
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

                {/* Where stays the input and the button to send the message */}
                <div id="interactivity">
                    <input 
                    type='text' 
                    ref={refForInputThatSendMessage}
                    placeholder={textsLang.inputPlaceHolder[lang]}
                    value={message}
                    onChange={(e)=>{
                        setMessage(e.target.value)
                        setCharactersCounter(e.target.value.length)
                    }}/>
                    <span className="material-symbols-outlined" onClick={sendMessage}>send</span>
                </div>

                {charactersCounter > 1024 ? 
                <span id='charactersCounter' className='greaterThan'>{charactersCounter}/1024</span> : 
                <span id='charactersCounter' className='lessThan'>{charactersCounter}/1024</span>}
            </div>

            <p id='UserCounteur'>{textsLang.userCount[lang]} {userCounteur}</p>
            <LanguageOptions getLang={getLang}/>
        </div>
    )
}

export default ChatM