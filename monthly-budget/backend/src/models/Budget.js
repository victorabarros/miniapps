const { Model, DataTypes } = require("sequelize")
const { v4: uuid } = require("uuid")


class budget extends Model {
  static init(sequelize) {
    super.init({
      recipeInstallId: DataTypes.STRING,
      category: DataTypes.STRING,
      amount: DataTypes.DECIMAL,
    }, { sequelize })
  }
}

const insertBudget = async (recipeInstallId, category, amount) =>
  await budget.create({ id: uuid(), recipeInstallId, category, amount })

const listBudgets = async (recipeInstallId) =>
  await budget.findAll({ where: { recipeInstallId } })

module.exports = { Budget: budget, insertBudget, listBudgets }
