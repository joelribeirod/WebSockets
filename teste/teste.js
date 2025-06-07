const WebSocket = require("ws")
const wss = new WebSocket.Server({
    port: 8081
})

function onMessage(ws, data){
	console.log(data.toString())
	ws.send("Mensagem recebida!")
}

function onError(ws, err){
	console.log(err)
	ws.send("Ouve um erro"+err)
}

function broadCast(jsonObject){
	if(!this.clients) return;
	this.clients.forEach(client => {
		if(client.readyState === WebSocket.OPEN){
			client.send(JSON.stringify(jsonObject))
		}
	})
}

function onConnection(ws, req){
	console.log("conectado")
	ws.on("message", data => onMessage(ws, data))
	ws.on("error", err => onError(ws, err))
}

wss.on("connection", onConnection)
wss.broadcast = broadCast

setInterval(()=>{
    wss.broadcast({teste: "suave?"})
},5000)

console.log("Servidor Rodando")