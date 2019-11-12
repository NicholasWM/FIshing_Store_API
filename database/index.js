const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const Compras = require('../app/models/Compras');
const LivroCaixa = require('../app/models/LivroCaixa');
const Produtos = require('../app/models/Produtos');
const User = require('../app/models/User');
const Compras_Produtos = require('../app/models/Compras_Produtos');
const Estoque = require('../app/models/Estoque');

const connection = new Sequelize(dbConfig);

User.init(connection);
Compras.init(connection);
Produtos.init(connection);
LivroCaixa.init(connection);
Compras_Produtos.init(connection);
Estoque.init(connection);

Compras.associate(connection.models);
Produtos.associate(connection.models);
Compras_Produtos.associate(connection.models);
Estoque.associate(connection.models);

module.exports = connection;