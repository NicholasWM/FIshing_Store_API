'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
      */
    return queryInterface.createTable('LivroCaixa', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      // Entrada ou Saída
      tipo_transacao: {
        allowNull: false,
        type: Sequelize.STRING
      },
      // Dinheiro, Débito, Depósito, Crédito
      modo: {
        allowNull: false,
        type: Sequelize.STRING
      },
      // O pedido inteiro tem mais de um item
      //O livro caixa mostra a transacao de cada item individualmente
      // Oque interliga eles é o ID do Pedido
      compra_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'compras', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      valor: {
        allowNull: false,
        type: Sequelize.FLOAT
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
