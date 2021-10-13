const Sequelize = require('sequelize')
const { Budget } = require('../models/Budget')
const { database: databaseConfig } = require('../../config')

const connection = new Sequelize({
  define: {
    timestamps: true,
  },
  ...databaseConfig
})

Budget.init(connection)

module.exports = connection
