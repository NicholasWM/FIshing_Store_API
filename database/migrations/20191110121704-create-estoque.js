'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Estoque', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      // Entrada, Saida
      modo: {
        allowNull: false,
        type: Sequelize.STRING
      },
      preco: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      quantidade: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      
      produto_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Produtos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('estoque');
  }
};