# WebSockets
## Documentação principal ainda em desenvolvimento, acesse outros projetos enquanto isso:
[chat Global](https://github.com/joelribeirod/WebSockets/tree/main/chatGlobal)
<br>
[chat Privado](https://github.com/joelribeirod/WebSockets/tree/main/chatPrivado)
<br>
[Chat M](https://github.com/joelribeirod/WebSockets/tree/main/chatM)

# O que WebSockets?
#### É uma tecnologia usada para criar comunicações estáveis entre 2 pontos ou mais, usada para criar chats e jogos em tempo real. Diferente do tradicional HTTP/HTTPS que faz ciclos de requisições/respostas, o WebSockets cria um canal onde fica esperando as requisições dos usuários, e depois as trata enviando ou não as respostas

# Como se utiliza?
## 🛠 Servidor
### Primeiro se instala o ws, ele é pacote mais popular para lidar com websockets. Mais usado, é versátil e simples porém n significa que ele é o melhor em eficiência
	npm install ws 
### Ao iniciar o projeto, deve se importar o ws para nossa aplicação
	const WebSocket = require("ws")

### Depois, é necessario criar um novo servidor (wss == Web Socket Server)
	const wss = new WebSocket.server({
		port: 3000
	})
 	O paramêtro port é o unico paramêtro obrigatorio, ele indica em qual porta o servidor irá rodar

### para criar a conexão, deve se usar uma função chamada 'on', passando o evento chamado 'connection'
	wss.on("connection", ()=>{})

 	O primeiro paramêtro é o tipo do evento, no caso, 'connection' 
  	Ou seja, quando alguem se conectar, o segundo parâmetro irá disparar
   
 	O segundo parâmetro significa qual código irá rodar 
  	Poder ser uma função exterior, uma callback function, arrow function, etc

### Quando recebememos uma requisição, podemos, diferenciar o tipo requisição, e assim trata-la
#### Para isso, dentro do wss.on, precisamos passar dois parâmetros para a função de callback chamados ws e req
#### O ws são as informações de quem enviou, o req é oq foi enviado
	wss.on("connection", (ws,req)=>{})
#### Dentro da requisição de callback, podemos utilizar alguns metódos, porém agora vou focar somente em 3
	message
 	close
  	error

#### Para acessa-los, utilizamos o primeiro parâmetro passado para nossa função de callback, o ws e utilizamos o metódo 'on'
	ws.on()
#### Depois passamos o tipo de mensagem que irremos tratar dentro do código
	ws.on("message", ()=>{})
 	ws.on("close", ()=>{})
  	ws.on("error",()=>{})

 ### O "message", é para quando alguém enviar uma mensagem para o servidor
 	ws.on("message", (data)=>{
  		console.log(JSON.parse(data))
	})
 
 *O WebSockets trabalha somente com o envio de strings, por isso quando uma mensagem chega, precisamos transforma-la no formato JSON*
 *Ou toString, depende de como você irá tratar a mensagem, se será um objeto ou uma string simples*

### O evento 'error' é bem parecido, ele diz que, quando ouver um erro, irá disparar uma função passando o err (erro que aconteceu durante a conexão)
	ws.on("message", (err)=>{
  		console.log(err)
	})
### O evento 'close' segue a mesma lógica, porém ele é disparado quando o usuário se desconecta do servidor
	ws.on("close", ()=>{
  		console.log('usuário se desconectou')
	})

### E também temos o ws.send(), que retorna para o usuário uma mensagem
	ws.on("message", (data)=>{
  		console.log(JSON.parse(data))
    		ws.send("Mensagem recebida!")
	})
 

### Outro funcionalidade útil do ws é poder enviar uma mensagem broadcast (enviar a mensagem para varias pessoas)

Para criar uma função broadcast, devemos defini-la para enviar a mensagem para todos. Exemplo:

	1 function broadCast(jsonObject){
	2	 if(!this.clients) return;
	3	 this.clients.forEach(client => {
	4		 if(client.readyState === WebSocket.OPEN){
	5			 client.send(JSON.stringify(jsonObject))
	6		 }
	7	 })
	8 }

2- Se não houver clientes conectados, não faça nada <br>
3- Para cada client conectado, faça <br>
4- Se o estado do cliente estiver conectado/preparado <br>
5- Mande ao cliente uma mensagem

#### Depois se quiser, pode pegar essa função e seta-la no wss 
 	wss.<nome do campo que vai receber a função> = <nome da função>
  	wss.broadcast = broadCast
*Fazendo isso, sempre que vc chamar wss.broadcast, você pode acessar a função que mandará a mesangem que vc quiser. Exemplo:*

#### Fazer algo bem simples como enviar a hora atual para os usuários de 5 em 5 segundos, apenas para fins didaticos:

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

