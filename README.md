# WebSockets
## Documentação principal ainda em desenvolvimento, acesse outros projetos enquanto isso:
[chat Global](https://github.com/joelribeirod/WebSockets/tree/main/chatGlobal)
<br>
[chat Privado](https://github.com/joelribeirod/WebSockets/tree/main/chatPrivado)

## rascunho Sobre como utilizar WebSockets

***Servidor***
npm install ws -> pacote mais popular para lidar com websockets | mais usado, é versátil e simples n significar é o melhor em eficiência

Ao iniciar o projeto, deve se importar o ws:
const WebSocket = require("ws")

Depois criar um novo servidor (wss == web socket server)
const wss = new WebSocket.server({
	port: 3000
})
*O paramêtro port é o unico paramêtro obrigatorio*

para criar a conexão, deve se usar uma função chamada 'on', passando o evento chamado 'connection':
wss.on("connection", onConnection)

o primeiro paramêtro é o nome do evento, e o segundo paramêtro é a função que será disparada quando o evento ocorrer
ou seja, quando alguem se conectar ao servidor, a função será disparada

function onConnection(){
	console.log("conectado")
}

dentro do onConnection, é possível configurar eventos dentro da função, só precisamos passar 2 paramêtros, o ws que é quem mandou e o req que é a requisição

function onConnection(ws, req){
	console.log("conectado")
}

function onConnection(ws, req){
	console.log("conectado")
	ws.on("message", data => onMessage(ws, data))
	ws.on("error", err => onError(ws, err))
}

o evento 'message' diz que, quando ouver uma mensagem, irá disparar a função onMessage passando o ws e o data (dados que foram enviados para do usuário)
o evento 'error' diz que, quando ouver um erro, irá disparar a função onError passando o ws e o err (erro que aconteceu durante a conexão)

Lembrando que o onMessage e o onError é o proprio programador que irá criar e definir essas funções. Como:

function onMessage(ws, data){
	console.log(data.toString())
	ws.send("Mensagem recebida!")
}

console.log(data.toString()) exibe a mensagem que o usuário enviou para o servidor
ws.send("Mensagem recebida!") retorna para o usuário uma mensagem, nesse caso foi "Mensagem recebida!"

broadcast == enviar mensagem para varias pessoas

Para criar uma função broadcast, devemos defini-la e depois seta-la ao nosso wss. Exemplo:

function broadCast(jsonObject){
1	if(!this.clients) return;
2	this.clients.forEach(client => {
3		if(client.readyState === WebSocket.OPEN){
4			client.send(JSON.stringify(jsonObject))
		}
	})
}

1- Se não houver clientes conectados, não faça nada
2- Para cada client conectado, faça
3- Se o estado do cliente estiver conectado/preparado
4- Mande ao cliente uma mensagem

depois, para setar esse broadcast no wss, devemos escrever:
wss.broadcast = broadCast

por fim, podemos fazer algo bem simples como enviar a hora atual para o usuário de 5 em 5 segundos, apenas para fins didaticos:

setInterval(()=>{
	wss.broadcast({time: new Date()})
}, 5000)

***Cliente***
const ws = new WebSocket('ws://localhost:8080') || Conexão com o servidor

ws.onopen = () => {
    console.log('Conectado ao servidor WebSocket');
}

ws.onerror = ()=>{
    window.alert("Falha ao se conectar com o servidor")
}

ws.onclose = (e)=>{
    if(e.wasClean){
        console.log("Servidor fechou: "+e.code)
    }else{
        window.alert("Conexão caiu inesperadamente")
    }
}

ws.onmessage = (event) => {
    ...
}

ws.send(JSON.stringify(pacote))

ws.onopen = Quando houve sucesso ao se conectar ao servidor
ws.onerror = Quando não houve sucesso ao se conectar ao servidor
ws.onclose = Quando a conexão foi perdida, pelo server ter sido fechado ou por outro motivo
ws.onmessage = Quando alguma mensagem foi recebida e como será tratada essa resposta
ws.send() = Resposta a ser enviada de volta ao servidor

