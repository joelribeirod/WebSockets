import { useState } from 'react'
import './ChatM.css'

function ChatM(){
    const [message, setMessage] = useState()

    function sendMessage(){
        if(message.length == 0 || message == undefined || message == null){
            window.alert('please, write something before sending it')
            return null
        }

        const verifyIfHaveName = message.split(" ")[0]
        
        if(verifyIfHaveName[0] == '/'){
            let name = verifyIfHaveName.slice(1)
            let removingName = message.split(" ").slice(1)
            let joiningTheMessage = removingName.join(" ")

            const userPackage = {
                from: 'joel',
                to: name,
                message: joiningTheMessage,
                type: 'private_message'
            }

            console.log(userPackage)
        }else {
            let userMessage = message

            const userPackage = {
                from: 'joel',
                message: userMessage,
                type: 'public'
            }

            console.log(userPackage)
        }
    }

    return (
        <div id="chatPage">
            <h1>Chat M</h1>
            <div id="chat">
                <div id='changeConversations'>
                    <span id='0' class="material-symbols-outlined">globe</span>
                </div>
                <div id="conversations">
                    <div id='globalChat' className='conversation'>
                        <p>Use /user to iniciate a private conversation</p>
                        <p>Be polite with others, and hf</p>
                    </div>
                </div>
                <div id="interactivity">
                    <input type='text' placeholder='Send your message' onChange={(e)=>{
                        setMessage(e.target.value)
                    }}/>
                    <span class="material-symbols-outlined" onClick={sendMessage}>send</span>
                </div>
            </div>
        </div>
    )
}

export default ChatM