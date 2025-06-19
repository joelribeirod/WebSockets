const userName = document.getElementById('userName')
const userPassword = document.getElementById('userPassword')
const enviar = document.getElementById('enviar')

const serverUrl = 'http://localhost:8081'

enviar.addEventListener('click', ()=>{
    if(userName.value == null || userName.value == undefined || userName.value.length < 4){
        window.alert('preencha os dados corretamente')
        return null
    }

    if(userPassword.value == null || userPassword.value == undefined || userPassword.value.length < 4){
        return null
    }
    
    const user = {
        name: userName.value,
        password: userPassword.value
    }

    let promise = fetch(`${serverUrl}/userGet`,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }).then((resp)=>resp.json())

    Promise.resolve(promise).then(
        (resp)=>{
            if(resp.success){
                localStorage.setItem('token', resp.token)
                const tokenDuration = Date.now() + resp.tokenDuration * 1000;
                localStorage.setItem('tokenDuration', tokenDuration)
                
                window.location.replace('http://127.0.0.1:5500/chatPrivado/frontEnd/privateChat.html')
            }else if(resp.err){
                console.log(resp.err)
            }
        }
    ).catch(
        (err)=>console.log(err)
    ).finally(()=>console.log('promise finalizada'))
})