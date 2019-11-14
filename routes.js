const UserController = require('./app/controllers/user');
const LivroCaixaController = require('./app/controllers/livro_caixa');
const ProdutosController = require('./app/controllers/produto');
const ComprasController = require('./app/controllers/compra');
const EstoqueController = require('./app/controllers/estoque');
const express = require('express');
const routes = express.Router();
const multer = require('multer')

const uploadConfig = require('./config/upload')

const upload = multer(uploadConfig)

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

//Produtos
routes.post('/produtos', upload.single('picture'),ProdutosController.inserir_produto)
routes.get('/produtos', ProdutosController.list_all)

//Compras
routes.post('/compras', ComprasController.inserir_compra)
routes.post('/compras/:compra_id/inserir', ComprasController.adicionar_a_compra)
routes.post('/compras/:compra_id/:item_id', ComprasController.atualizar_item_compra)

routes.get('/compras', ComprasController.list_all)
routes.get('/compras/abertas', ComprasController.lista_compras_abertas)
routes.get('/compras/:compra_id/compra', ComprasController.listar_pedidos_compra)

routes.delete('/compras/:compra_id/:item_id', ComprasController.apagar_item_compra)
routes.delete('/compras/:compra_id', ComprasController.apagar_compra)

// Estoque
routes.get('/estoque', EstoqueController.listar_mes_atual)
routes.get('/estoque/mesAtual', EstoqueController.listar)
routes.post('/estoque/registro', EstoqueController.inserir_registro)


module.exports = routes