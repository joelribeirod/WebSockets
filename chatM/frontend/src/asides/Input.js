function Input({text, type, placeholder}){
    return (
        <div>
            <p>{text}</p>
            <input type={type} placeholder={placeholder}/>
        </div>
    )
}

export default Input