

function DivConversation({userName, messages, className}){
    return(
        <div id={userName} className={className}>
            <div className="divUserName">
                <h1 className="mainName">{userName}</h1>
            </div>
            {messages && messages.map((text, index) => (
                text.sender === 'origin' ? (
                    <p key={index} className="origin">{text.message}</p>
                ) : text.sender === 'host' ? (
                    <p key={index} className="host">{text.message}</p>
                ) : null
            ))}
        </div>
    )
}

export default DivConversation