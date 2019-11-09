const express = require('express');
const cors = require('cors')
const routes = require('./routes')
const app = express();

app.use(cors()) // Estudar CORS, ele permite que se controle quem tem acesso a API
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: false }));

app.use(routes)

app.listen(3333);