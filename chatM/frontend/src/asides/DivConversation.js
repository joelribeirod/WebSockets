

function DivConversation({userName, messages, className}){
    return(
        <div id={userName} className={className}>
            {messages && messages.map((mensagem) => (
                <p>{mensagem.message}</p>
            ))}
        </div>
    )
}

export default DivConversation