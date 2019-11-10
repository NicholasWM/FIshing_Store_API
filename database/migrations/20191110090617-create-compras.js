'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
      */
    return queryInterface.createTable('Compras', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      }, 
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      nome: {
        allowNull: true,
        type: Sequelize.STRING
      },
      barqueiro: {
        allowNull: false,
        type: Sequelize.STRING
      },
      pago: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
    });
  },

  down: (queryInterface) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
      */
    return queryInterface.dropTable('Compras');
  }
};
