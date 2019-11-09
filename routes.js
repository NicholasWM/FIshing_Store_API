const UserController = require('./app/controllers/user');
const LivroCaixaController = require('./app/controllers/livro_caixa');
const express = require('express');
const routes = express.Router();

// USER
routes.post('/register', UserController.register);
routes.put('/users/:id/', UserController.update); //Editar
routes.get('/users', UserController.list_all); //Listar todos
routes.post('/users', UserController.create); // Criar
routes.get('/user/:id',UserController.search_by_id); //Buscar
routes.delete('/users/:id', UserController.delete_by_id); //Deletar

//Livro Caixa
routes.post('/livro_caixa', LivroCaixaController.transacao)
routes.delete('/livro_caixa', LivroCaixaController.apagar_transacao)
routes.get('/livro_caixa/mes_atual', LivroCaixaController.listar_mes_atual)
routes.get('/livro_caixa/mes_passado', LivroCaixaController.listar_mes_passado)
routes.get('/livro_caixa/mes_retrasado', LivroCaixaController.listar_mes_retrasado)
routes.get('/livro_caixa/semana_atual', LivroCaixaController.listar_semana_atual)
routes.get('/livro_caixa/semana_passada', LivroCaixaController.listar_semana_passada)


module.exports = routes