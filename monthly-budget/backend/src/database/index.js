const Sequelize = require('sequelize')
const { Budget } = require('../models/Budget')
const databaseConfig = require('../config/database')

const connection = new Sequelize({
  // TODO: define log level
  define: {
    timestamps: true,
  },
  ...databaseConfig
})

Budget.init(connection)

module.exports = connection
