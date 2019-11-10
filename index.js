const express = require('express');
const cors = require('cors')
const routes = require('./routes')
const path = require('path')

require('./database');
const app = express();
app.use(cors()) // Estudar CORS, ele permite que se controle quem tem acesso a API
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: false }));

app.use('/files', express.static(path.resolve(__dirname, 'uploads')))// Forma q o Express utiliza para retornar arquivos staticos(img,pdfs...)

app.use(routes)
app.listen(3333);