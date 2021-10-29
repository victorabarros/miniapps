'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('budgets', {
      id: {
        type: Sequelize.STRING(36),
        primaryKey: true,
        allowNull: false,
      },
      recipeInstallId: {
        type: Sequelize.STRING(36),
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(6, 2),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    }, {
      uniqueKeys: {
        actions_unique: {
          fields: ['recipeInstallId', 'category']
        }
      }
    })
    await queryInterface.addIndex('budgets', ['recipeInstallId'])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('budgets');
  }
};
