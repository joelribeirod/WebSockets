function Input({text, type, placeholder, id}){
    return (
        <div>
            <p>{text}</p>
            <input id={id} type={type} placeholder={placeholder}/>
        </div>
    )
}

export default Input