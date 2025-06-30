

function DivConversation({userName, messages, className}){
    return(
        <div id={userName} className='conversation off'>
            <p className='mensagem'>Fulano: Salve</p>
        </div>
    )
}

export default DivConversation