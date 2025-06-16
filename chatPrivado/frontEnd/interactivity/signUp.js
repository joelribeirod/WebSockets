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
        passWord: userPassword.value
    }

    let promise = fetch(`${serverUrl}/userPost`,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }).then((resp)=>resp.json())

    Promise.resolve(promise).then(
        (resp)=>{
            if(resp.success){
                window.alert('Sucesso ao cadastrar o usuario')
                window.location.replace('http://127.0.0.1:5500/frontEnd/chatGlobal.html')
            }else if(resp.err){
                window.alert(resp.err)
            }
        }
    ).catch(
        (err)=>console.log(err)
    ).finally(()=>console.log('promise finalizada'))
})
