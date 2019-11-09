'use strict';

module.exports = {
  up: (queryInterface, DataTypes) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
      */
     return queryInterface.createTable('LivroCaixa', {
        id: {
          allowNull: false,
          autoIncrement:true,
          primaryKey: true,
          type:DataTypes.INTEGER
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        // Estacionamento, Quiosque, Barco, Sardinha...
        categoria:{
          allowNull:false,
          type:DataTypes.STRING
        },
        // Entrada ou Saída
        tipo_transacao:{
          allowNull:false,
          type:DataTypes.STRING
        },
        // Dinheiro, Débito, Depósito, Crédito
        modo:{
          allowNull: false,
          type:DataTypes.STRING
        },
        // O pedido inteiro tem mais de um item
        //O livro caixa mostra a transacao de cada item individualmente
        // Oque interliga eles é o ID do Pedido
        numero_pedido:{
          allowNull: true,
          type: DataTypes.INTEGER
        },
        valor:{
          allowNull:false,
          type:DataTypes.FLOAT
        }
      });
  },

  down: (queryInterface) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
      */
     return queryInterface.dropTable('LivroCaixa');
  }
};
