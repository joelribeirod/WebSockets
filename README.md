# WebSockets
### Projetos pessoais desenvolvidos utilizando Web Sockets:
[Chat Global](https://github.com/joelribeirod/WebSockets/tree/main/chatGlobal)
<br>
[Chat Privado](https://github.com/joelribeirod/WebSockets/tree/main/chatPrivado)
<br>
[Chat M](https://github.com/joelribeirod/WebSockets/tree/main/chatM)

# O que são WebSockets?
#### É uma tecnologia usada para criar comunicações estáveis entre 2 pontos ou mais, usada para criar chats e jogos em tempo real. Diferente do tradicional HTTP/HTTPS que faz ciclos de requisições/respostas, o WebSocket cria um canal onde fica esperando as requisições dos usuários, e depois as trata enviando ou não as respostas. O cliente inicia a conexão fazendo uma requisição HTTP ao servidor, porém depois que a conexão foi estabelecida, o WebSocket assume essa conexão, fazendo uma ponto estável entre cliente-servidor.

# Lógica passo-a-passo
## 🛠 Servidor
### *1.0* - Nesse projeto utilizamos o módulo ws, que é utilizado para podermos criar um server WebSocket, ele é utilizado pela versátilidade e simplicidade, porém isso não significa que ele é o melhor em eficiência, ainda assim ele é o pacote mais popular para lidar com websockets.

### *1.2* - Após importarmos ele, criamos o servidor utilizando a convenção wss (web socket server), esse servidor será por onde as pessoas irão se conectar, estabelecendo assim uma conexão estável entre servidor e cliente. Normalmente quando criamos uma api, elá cria um endpoint (ponto de entrada) parecido com *http://localhost:8081*, um servidor WebSocket faz o mesmo, mas ele não usa o protocolo http para manter a conexão, ele usa o protocolo *ws*, ficando o endpoint assim: *ws://localhost:8081*

### *1.3* - O método .on() significa, 'quando', e passando o parâmetro 'connection' dizemos que "Quando houver uma conexão faça: "

### *1.4* - Dentro da função de callback (função que dispara após algo acontecer), passamos o parâmetro 'ws' e 'req'. 'ws' representa a conexão ativa com o cliente, enquanto o 'req' representa a requisição http que foi enviada pelo usuário ao se conectar (sim, o ws utiliza o próprio protocolo para manter a conexão, mas para o cliente se conectar ao servidor, utilizamos uma requisição http). <br>Dentro da função de callback podemos utilizar novamente o método '.on', aq focaremos em 3 parâmetros, *message*, *close* e *error*, dentro do .on podemos passar outra função de callback, por exemplo, quando alguém enviar uma mensagem (message), uma função disparará, quando alguém fechar a conexão, outra função, e quando houver algum erro durante a conexão com o cliente, outra função.

### *1.5* - Exemplo de quando o servidor recebe uma mensagem. Dentro da função de callback passamos o parâmetro 'data', é através dele que temos acesso ao que o usuário/cliente nos enviou. E para ter acesso à esse conteúdo, devemos utilizar o 'JSON.parse()', isso faz com que transformemos uma string em um objeto JSON, isso é extremamente necessário pois, o WebSocket não suporta enviar objetos JSON, por isso enviamos objetos transformados em string (JSON.stringify())

### *1.8* - Também temos o método '.send', ele é utilizado para que possamos enviar uma mensagem do servidor para o usuário

### *1.9* - E por último, temos a possibilidade de criar uma função broad cast, que significa, criar uma função que pode enviar uma mensagem a todos os usuários conectados ao servidor, lembrando que essa função não é nativa do 'ws', nós, programadores a criamos, e podemos atrela-la ao nosso objeto 'wss' (web socket server, lá do passo 1.2), para isso basta pegar o objeto, acessar um campo dele, e inserir a função, confuso? Um pouco, mas é assim, 'wss.broadcast = function ...', o campo broadcast no nosso objeto não existe, mas quando declaramos que esse campo vai receber uma função, o JavaScript cria o campo broadcast no nosso objeto, é como adicionar uma nova propriedade a um objeto dinamicamente, inserindo a função como valor, assim futuramente podendo acessar a função apenas utilizando 'wss.broadcast()'

### Essa é a explicação da lógica por trás do servidor, agora, vamos entender como funciona a lógica no lado do cliente.

## 👨‍💼 Cliente
### *2.0* - No lado do cliente, utilizamos um método nativo do JavaScript, WebSocket, passando como parâmetro nossa URL de onde nosso servidor está sendo executado, e guardamos essa conexão dentro de uma variável, por convenção a chamamos de 'ws'
### *2.1* - Com a conexão estabelecida, usamos alguns métodos para controlar o fluxo de informações, são esses métodos : '.onopen', 'onerror', 'onclose', 'onmessage' e 'send'
### *2.3* - O método 'ws.onopen' representa a função callback que será executada quando o ws detectar que houve sucesso ao se conectar ao servidor
### *2.5* - O método 'ws.onerror' representa a função callback que será executada quando não houver sucesso ao se conectar ao servidor
### *2.7* - O método 'ws.onclose' representa a função callback que será executada quando o cliente perder a conexão com o servidor
### *2.8* - O método 'ws.onmessage' representa a função callback que será executada quando o servidor enviar uma mensagem ao cliente
### *2.9* - O método 'ws.send' é a função que utilizaremos para enviar uma resposta/mensagem ao servidor, normalmente utilizado ao longo do código sempre que será necessário enviar algo ao servidor

# ⌨ Como se utiliza?
## 🛠 *1* - Servidor
### *1.0* - Primeiro se instala o ws.
	npm install ws 
### *1.1* - Ao iniciar o projeto, deve se importar o ws para nossa aplicação
	const WebSocket = require("ws")

### *1.2* - Depois, é necessario criar um novo servidor (wss == Web Socket Server)
	const wss = new WebSocket.server({
		port: 3000
	})
 	O parâmetro port é o unico parâmetro obrigatorio, ele indica em qual porta o servidor irá rodar

### *1.3* - para criar a conexão, deve se usar uma função chamada 'on', passando o evento chamado 'connection'
	wss.on("connection", ()=>{})

 	O primeiro parâmetro é o tipo do evento, no caso, 'connection' 
  	Ou seja, quando alguem se conectar, o segundo parâmetro irá disparar
   
 	O segundo parâmetro significa qual código irá rodar 
  	Poder ser uma função exterior, uma callback function, arrow function, etc

### *1.4* - Diferenciando tipos de requisição para trata-las
#### *1.4.1* - Para isso, dentro do wss.on, precisamos passar dois parâmetros para a função de callback chamados ws e req
#### *1.4.2* - O ws é a conexão ativa com o cliente, o req é a requisição HTTP que foi enviada para iniciar a conexão WebSocket
	wss.on("connection", (ws,req)=>{})
#### *1.4.4* - Dentro da função de callback, podemos utilizar alguns métodos, porém agora vou focar somente em 3
	message
 	close
  	error
#### *1.4.6* - Para acessa-los, utilizamos o primeiro parâmetro passado para nossa função de callback, o ws e utilizamos o método 'on'
	ws.on()
#### *1.4.8* - Depois passamos o tipo de mensagem que irremos tratar dentro do código
	ws.on("message", ()=>{})
 	ws.on("close", ()=>{})
  	ws.on("error",()=>{})

### *1.5* - O "message", é para quando alguém enviar uma mensagem para o servidor
 	ws.on("message", (data)=>{
  		console.log(JSON.parse(data))
	})
 
 *O WebSocket trabalha somente com o envio de strings, por isso quando uma mensagem chega, precisamos transforma-la no formato JSON*
 *Ou toString, depende de como você irá tratar a mensagem, se será um objeto ou uma string simples*

### *1.6* - O evento 'error' para quando ocorer um erro, disparando uma função com o parâmetro 'err' (erro que aconteceu durante a conexão)
	ws.on("error", (err)=>{
  		console.log(err)
	})
### *1.7* - O evento 'close' segue a mesma lógica, porém ele é disparado quando o usuário se desconecta do servidor
	ws.on("close", ()=>{
  		console.log('usuário se desconectou')
	})

### *1.8* - E também temos o ws.send(), que retorna para o usuário uma mensagem
	ws.on("message", (data)=>{
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

 	"this.clients" é o conjunto de conexões WebSocket ativas no servidor.

*2- Se não houver clientes conectados, não faça nada* <br>
*3- Para cada client conectado, faça* <br>
*4- Se o estado do cliente estiver conectado/preparado* <br>
*5- Mande ao cliente uma mensagem*

#### *1.9.1* - Depois se quiser, pode pegar essa função e seta-la no wss 
 	wss.<nome do campo que vai receber a função> = <nome da função>
  	wss.broadcast = broadCast
*Fazendo isso, sempre que vc chamar wss.broadcast, você pode acessar a função que mandará a mensangem que vc quiser. Exemplo:*

#### *1.9.5* - Fazer algo bem simples como enviar a hora atual para os usuários de 5 em 5 segundos:

	setInterval(()=>{
		wss.broadcast({time: new Date()})
	}, 5000)

 	Exemplo didático de uso da função broadcast, enviando o horário atual a cada 5 segundos.

## 👨‍💼 *2* - Cliente
### *2.0* - Primeiro devemos criar uma nova conexão WebSocket
	const ws = new WebSocket('ws://localhost:8080') // Conexão com o servidor
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

