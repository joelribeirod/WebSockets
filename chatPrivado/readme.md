# 📖 O que é
### Segundo projeto de uma serie de 3, criado para aprendizado, que utiliza com principal tecnologia o WebSockets. A segunda parte disponibiliza a função de criação de vários chats privados com outros usuários. Websockets é uma ferramenta que possibilita a criação de uma comunicação simultânea entre cliente-servidor, utilizada na criação de jogos, chats em tempo real e outros sistemas de comunicação dinâmica.

# 🧠 Lógica no Front-End
Este projeto tem a única funcionalidade de chats privados, para envia uma mensagem, você tem que saber o nome do outro usuário que quiser conversar para poder então enviar uma mensagem, para isso, se utiliza o comando '/<NomeDeUsuario>'. Exemplo:

    /Joel Olá, tudo bem?
    -> Olá, tudo bem?

Quando uma mensagem é enviada, o servidor retorna se houve sucesso ao enviar a mensagem, se tiver sucesso, o front-end análise se existe a seção com aquela conversa, se não ele já cria uma nova seção para aquela conversa e adiciona a mensagem que foi enviada. <br><br>Caso uma mensagem seja recebida, o servidor envia um pacote para você avisando que o usuário X enviou uma mensagem. Então, o front-end faz a mesma verificação anterior de ver se a seção existe ou não.<br><br>
O Projeto é feito em html estático, por esse motivo, não é necessário controlar o total dos dados, apenas resgatamos o dado que o servidor enviou, e então o exibimos para o usuário atráves de um elemento html.

# 🛠️ Ferramentas Utilizadas

  Node.js <br>
  WebSockets <br>
  MongoDB <br>
  Mongoose <br>
  JavaScript <br>
  HTML <br>
  CSS <br>

# 🎯 Funcionalidades
☑ API RESTful <br>
☑ Comunicação entre usuários através de WebScokets <br> 
☑ Cadastro de usuários <br>
☑ Validação de login <br>
☑ JWT para Autentificação <br>

# 🎞 Visual do Projeto

## Sistema de Login
<div>
  <img src="readme-images/logarConta.png" alt="Entrar com uma conta" width="240" style="display:inline-block; margin-right: 10px;"/>
  <img src="readme-images/criarConta.png" alt="Criar uma conta" width="240" style="display:inline-block;"/>
</div>


## Enviar mensagens
<div>
  <img src="readme-images/chatPrivado.png" alt="chat Global" width="480"/>
  <img src="readme-images/chatPrivadoComMensagem.png" alt="chat Global com mensagens" width="480"/>
</div>


# ⚙ Como utilizar
<p>O projeto possui HTML estático, portanto é possível que você precise mudar as URLs no front-end. Já o servidor é necessário rodar 2 terminais, um para iniciar o banco de dados, e o outro para iniciar o servidor</p> <br>

## 🎲 Banco de Dados
### Garanta que antes de iniciar o servidor, você esteja com seu banco de Dados Mongo iniciado
Inicialização usando o comando mongod no terminal/prompt de comando: 

    Abra o terminal/prompt de comando e digite:
    mongod
Este comando iniciará o servidor MongoDB e ele começará a ouvir conexões no padrão porta 27017. 

**O Mongo ja cuida de criar um banco de dados assim que o primeiro dado for inserido**

## 📦 Back-end

### Navegue até a pasta do Back-End
    cd servidor
### Instale as dependências
    npm install
### Rode o projeto
    npm start

#### O servidor vai rodar em http://localhost:8081 (Você pode mudar a porta no código do servidor). O WebSocket vai rodar em ws://localhost:8080 (Você também pode mudar a porta no código do servidor)

## 📦 Front-End
    Navegue até a pasta do Front-End chamada 'interactivity'
### Arquivos de cadastro
#### Existem dois arquivos
    signIn.js
    signUp.js
#### Mude a constante 'serverUrl'
    Exemplo:
    const serverUrl = 'http://localhost:8081'
Nessa constante você tem que colocar a URL onde ser servidor está rodando

### Chat Global se conectando
No arquivo chatGlobal.js, a primeira linha será da conexão com seu servidor WebSockets.

    Exemplo:
    const ws = new WebSocket('ws://localhost:8080')
    
Garanta que a URL que está dentro dos parentêses é a mesma em que ser servidor webSockets está rodando

### Crie um arquivo dotenv para amazenar as configurações do JWT
    Crie um arquivo '.env' na pasta backEnd
    Configure as variaveis 'chaveSecreta' e 'tokenDuration'
    Exemplo: 
    chaveSecreta='minha_Aplicação'
    tokenDuration=7200
<p>Essas variaveis servem para a configuração do JWT (Json Web Token)</p>

## 📡 Endpoints que serão criados

### 📤 **POST**

| Rota                            | Descrição                                                                |
|:--------------------------------|:-------------------------------------------------------------------------|
| `/userPost`                   | Rota usada para cadastrar usuários                                                 |
| `/userGet`                 | Rota usada para encontrar um usuário e retornar um token JWT                                          |
