const express = require('express');
const cors = require('cors')
const routes = require('./routes')
const path = require('path')
const socketio = require('socket.io');
const http = require('http');

const app = express();

const server = http.Server(app);
const io = socketio(server);
const connectedUsers = {};

io.on('connection', socket => {
    const { user_id } = socket.handshake.query;
    console.log(user_id);
    
    connectedUsers[user_id] = socket.id;
});

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;
    

    return next();
})


require('./database');
app.use(cors()) // Estudar CORS, ele permite que se controle quem tem acesso a API
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: false }));

app.use('/files', express.static(path.resolve(__dirname, 'uploads')))// Forma q o Express utiliza para retornar arquivos staticos(img,pdfs...)

app.use(routes)
server.listen(3333);