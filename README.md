# WebSockets
### Projetos pessoais desenvolvidos utilizando Web Sockets:
[Chat Global](https://github.com/joelribeirod/WebSockets/tree/main/chatGlobal)
<br>
[Chat Privado](https://github.com/joelribeirod/WebSockets/tree/main/chatPrivado)
<br>
[Chat M](https://github.com/joelribeirod/WebSockets/tree/main/chatM)

# O que WebSockets?
#### É uma tecnologia usada para criar comunicações estáveis entre 2 pontos ou mais, usada para criar chats e jogos em tempo real. Diferente do tradicional HTTP/HTTPS que faz ciclos de requisições/respostas, o WebSockets cria um canal onde fica esperando as requisições dos usuários, e depois as trata enviando ou não as respostas

# Como se utiliza?
## 🛠 *1* - Servidor
### *1.0* - Primeiro se instala o ws, ele é pacote mais popular para lidar com websockets. Mais usado, é versátil e simples porém n significa que ele é o melhor em eficiência
	npm install ws 
### *1.1* - Ao iniciar o projeto, deve se importar o ws para nossa aplicação
	const WebSocket = require("ws")

### *1.2* - Depois, é necessario criar um novo servidor (wss == Web Socket Server)
	const wss = new WebSocket.server({
		port: 3000
	})
 	O paramêtro port é o unico paramêtro obrigatorio, ele indica em qual porta o servidor irá rodar

### *1.3* - para criar a conexão, deve se usar uma função chamada 'on', passando o evento chamado 'connection'
	wss.on("connection", ()=>{})

 	O primeiro paramêtro é o tipo do evento, no caso, 'connection' 
  	Ou seja, quando alguem se conectar, o segundo parâmetro irá disparar
   
 	O segundo parâmetro significa qual código irá rodar 
  	Poder ser uma função exterior, uma callback function, arrow function, etc

### *1.4* - Quando recebememos uma requisição, podemos, diferenciar o tipo requisição, e assim trata-la
#### *1.4.1* - Para isso, dentro do wss.on, precisamos passar dois parâmetros para a função de callback chamados ws e req
#### *1.4.2* - O ws são as informações de quem enviou, o req é oq foi enviado
	wss.on("connection", (ws,req)=>{})
#### *1.4.4* - Dentro da requisição de callback, podemos utilizar alguns metódos, porém agora vou focar somente em 3
	message
 	close
  	error

#### *1.4.6* - Para acessa-los, utilizamos o primeiro parâmetro passado para nossa função de callback, o ws e utilizamos o metódo 'on'
	ws.on()
#### *1.4.8* - Depois passamos o tipo de mensagem que irremos tratar dentro do código
	ws.on("message", ()=>{})
 	ws.on("close", ()=>{})
  	ws.on("error",()=>{})

### *1.5* - O "message", é para quando alguém enviar uma mensagem para o servidor
 	ws.on("message", (data)=>{
  		console.log(JSON.parse(data))
	})
 
 *O WebSockets trabalha somente com o envio de strings, por isso quando uma mensagem chega, precisamos transforma-la no formato JSON*
 *Ou toString, depende de como você irá tratar a mensagem, se será um objeto ou uma string simples*

### *1.6* - O evento 'error' é bem parecido, ele diz que, quando occorer um erro, irá disparar uma função passando o err (erro que aconteceu durante a conexão)
	ws.on("error", (err)=>{
  		console.log(err)
	})
### *1.7* - O evento 'close' segue a mesma lógica, porém ele é disparado quando o usuário se desconecta do servidor
	ws.on("close", ()=>{
  		console.log('usuário se desconectou')
	})

### *1.8* - E também temos o ws.send(), que retorna para o usuário uma mensagem
	1ws.on("message", (data)=>{
  		console.log(JSON.parse(data))
    		ws.send("Mensagem recebida!")
	})
 

### *1.9* - Outro funcionalidade útil do ws é poder enviar uma mensagem broadcast (enviar a mensagem para varias pessoas)

Para criar uma função broadcast, devemos defini-la para enviar a mensagem para todos. Exemplo:

	1 function broadCast(jsonObject){
	2	 if(!this.clients) return;
	3	 this.clients.forEach(client => {
	4		 if(client.readyState === WebSocket.OPEN){
	5			 client.send(JSON.stringify(jsonObject))
	6		 }
	7	 })
	8 }

*2- Se não houver clientes conectados, não faça nada* <br>
*3- Para cada client conectado, faça* <br>
*4- Se o estado do cliente estiver conectado/preparado* <br>
*5- Mande ao cliente uma mensagem*

#### *1.9.1* - Depois se quiser, pode pegar essa função e seta-la no wss 
 	wss.<nome do campo que vai receber a função> = <nome da função>
  	wss.broadcast = broadCast
*Fazendo isso, sempre que vc chamar wss.broadcast, você pode acessar a função que mandará a mesangem que vc quiser. Exemplo:*

#### *1.9.5* - Fazer algo bem simples como enviar a hora atual para os usuários de 5 em 5 segundos, apenas para fins didaticos:

	setInterval(()=>{
		wss.broadcast({time: new Date()})
	}, 5000)

## 👨‍💼 *2* - Cliente
### *2.0* - Primeiro devemos criar uma nova conexão WebSocket
	const ws = new WebSocket('ws://localhost:8080') || Conexão com o servidor
*Note que a url que o web sockets roda não é 'http://', e sim 'ws://'*

### *2.1* - Após criarmos a conexão, podemos usar alguns métodos para controlar o fluxo do código. São eles: 
	ws.onopen
	ws.onerror
	ws.onclose
	ws.onmessage
	ws.send()

### *2.3* - ws.onopen Código que será executado quando houver sucesso ao se conectar ao servidor
	ws.onopen = () => {
	    console.log('Conectado ao servidor WebSocket');
	}

### *2.5* - ws.onerror = Código que será executado quando não houver sucesso ao se conectar ao servidor	
	ws.onerror = ()=>{
	    window.alert("Falha ao se conectar com o servidor")
	}

### *2.7* - ws.onclose = Código que será executado quando a conexão for perdida, pelo server ter sido fechado ou por outro motivo
	ws.onclose = (e)=>{
	    if(e.wasClean){
	        console.log("Servidor fechou: "+e.code)
	    }else{
	        window.alert("Conexão caiu inesperadamente")
	    }
	}

### *2.8* - ws.onmessage = Código que será executado quando alguma mensagem for recebida e como será tratada essa resposta
	ws.onmessage = (event) => {
	    const data = JSON.parse(event.data)
     	    console.log(`Nova mensagem! ${data}`)
	}

### *2.9* - E o ws.send() que é a resposta/mensagem a ser enviada de volta ao servidor
	const pacote = {
 		usuário: "Joel",
   		mensagem: "Olá servidor"
	}
	ws.send(JSON.stringify(pacote))
*Note que ao enviar uma mensagem ao servidor, devemos faze-la passar pelo processo de 'JSON.stringify()'*
*Isso se deve pois o Web Sockets só trabalha enviando strings*

