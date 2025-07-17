*Ainda não está finalizado, faltão alguns detalhes*
# 📖 O que é
### Terceiro projeto de uma serie de 3, criado para aprendizado, que utiliza com principal tecnologia o WebSockets. A primeira parte cria um unico chat global. A segunda parte possibilita a criação de vários chats privados com outros usuários. A terceira parte é o projeto que junta esses 2 conceitos, possibilita o uso de um chat global e a função de poder conversar em chats privados. Por fim websockets é uma ferramenta utilizada para a criação de uma comunicação simultânea entre cliente-servidor, posibilitando a criação de jogos, chats em tempo real e outros sistemas de comunicação dinâmica.

# 🛠️ Ferramentas Utilizadas

  Node.js <br>
  React.js <br>
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
  <img src="" alt="Entrar com uma conta" width="240" style="display:inline-block; margin-right: 10px;"/>
  <img src="" alt="Criar uma conta" width="240" style="display:inline-block;"/>
</div>


## Enviar mensagens
<div>
  <img src="" alt="" width="480"/>
  <img src="" alt="" width="480"/>
</div>


# ⚙ Como utilizar
<p>O Projeto é dividido em 2 pastas principais, uma para o Front-end com React.js e outra para o Back-end com Node.js, serão necessário rodar 3 terminais, pois você também precisa inicializar ser banco de dados</p> <br>

## 🎲 Banco de Dados
### Garanta que antes de iniciar o servidor, você esteja com seu banco de Dados Mongo iniciado
Inicialização usando o comando mongod no terminal/prompt de comando: 

    Abra o terminal/prompt de comando e digite:
    mongod
Este comando iniciará o servidor MongoDB e ele começará a ouvir conexões no padrão porta 27017. 

**O Mongo ja cuida de criar um banco de dados assim que o primeiro dado for inserido**

## 📦 Front-End

### Navegue até a pasta do Front-End
    cd frontend
### Instale as dependências
    npm install
### Inicialize o projeto
    npm start
### Crie um arquivo dotenv para amazenar a URL (Opcional)
    Crie um arquivo '.env'
    Configure a URL gerada pelo servidor. Exemplo: 
    REACT_APP_URLCONNECTIONWS='ws://localhost:8081'
    REACT_APP_URLCONNECTIONHTTP='http://localhost:8081'
<p>Isso fará com que toda a aplicação Front-end se conecte com o servidor</p>
<p>Essa parte é opcional pois o código ja possui uma verificação sobre se existem variáveis .env, se n existe ele usa os valores padrões, que são os mesmos do código de exmplo acima</p>

## 📦 Back-end

### Navegue até a pasta do Back-End
    cd servidor
### Instale as dependências
    npm install
### Rode o projeto
    npm start

#### O servidor vai rodar em http://localhost:8081 (Você pode mudar a porta no código do servidor). O WebSocket está integrado no servidor, portanto a porta será a mesma porta, a diferença é que, para acessar o ws, você ao invés de usar 'http://', usará 'ws://'

### Crie um arquivo dotenv para amazenar as configurações do JWT
    Crie um arquivo '.env' na pasta backEnd
    Configure as variaveis 'chaveSecreta', 'tokenDuration' e 'dbConnectionURL'
    Exemplo: 
    chaveSecreta='minha_Aplicação'
    tokenDuration=7200
    dbConnectionURL='mongodb://127.0.0.1:27017/chatM'
<p>chaveSecreta e tokenDuration servem de controle para a configuração do JWT. Já o 'dbConnectionURL' é essencial para criar a conexão entre servidor e banco de dados</p>

## 📡 Endpoints que serão criados

### 📤 **POST**

| Rota                            | Descrição                                                                |
|:--------------------------------|:-------------------------------------------------------------------------|
| `/createUser`                   | Rota usada para cadastrar usuários                                                 |
| `/returnUser`                 | Rota usada para encontrar um usuário e retornar um token JWT                                          |
