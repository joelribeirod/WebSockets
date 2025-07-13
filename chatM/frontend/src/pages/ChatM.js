import { useEffect, useRef, useState } from 'react'
import { useNavigate} from "react-router-dom"
import './ChatM.css'
import Span from '../asides/Span'
import DivConversation from '../asides/DivConversation'

function ChatM(){
    const ws = useRef(null)
    const dataForTheSpansRef = useRef(null)
    const dataForTheDivsRef = useRef(null)
    const refForMessages = useRef(null)

    const refForActivatedDiv = useRef(null)
    
    const [activatedDiv, setActivatedDiv] = useState([])
    const [userCounteur, setUserCounteur] = useState(0)
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
        navigate('/signIn')
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
            navigate('/signIn')
        }

        if(Number(tokenDuration) + Date.now() < Date.now()){
            localStorage.removeItem('token')
            localStorage.removeItem('tokenDuration')
            navigate('/signIn')            
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

        ws.current = new WebSocket('ws://localhost:8081')

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

                // clear the input message after sending the message
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
                setMessage('')
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
                window.alert("Something went wrong with our server, please try reload the page or come later")
            }
        }

        // If the connection goes wrong
        ws.current.onerror = ()=>{
            window.alert("Failure when connection with the server")
        }
    },[])

    // Function for when a user try to send a message
    function sendMessage(){
        // Get the div that the user are typing
        const divSelected = document.querySelector('.on').id

        // Analyses if isn't a null message
        if(message.length === 0 || message === undefined || message === null){
            return null
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
    }

    return (
        <div id="chatPage">
            <h1>Chat M</h1>

            <div id='userInfo'>
                <button id="logOut" onClick={()=>(closeWS())}>
                    <span class="material-symbols-outlined">logout</span>
                </button>
                <h1>User: {getUserName()}</h1>
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
                        <p className='rulesAndInfos'>Use /user to iniciate a private conversation</p>
                        <p className='rulesAndInfos'>Be polite with others, and hf</p>
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
                    <input type='text' 
                    placeholder='Send your message' 
                    value={message}
                    onChange={(e)=>{
                        setMessage(e.target.value)
                    }}/>
                    <span className="material-symbols-outlined" onClick={sendMessage}>send</span>
                </div>
            </div>

            <p id='UserCounteur'>Online Users: {userCounteur}</p>
        </div>
    )
}

export default ChatM