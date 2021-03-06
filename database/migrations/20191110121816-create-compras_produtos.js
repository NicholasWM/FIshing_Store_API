'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('compras_produtos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      produto_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Produtos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      quantidade:{
        allowNull:false,
        type: Sequelize.FLOAT
      },
      preco_total:{
        allowNull:false,
        type: Sequelize.FLOAT
      },
      compra_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Compras', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      estoque_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Estoque', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('compras_produtos');
  }
};