'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('utilizadores', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false
      },
      utilizador: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      chavePublica: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      estado: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      userLevel: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('utilizadores');
  }
};
