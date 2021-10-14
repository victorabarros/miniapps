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

const upsertBudget = async (recipeInstallId, category, amount) => {
  const resp = await budget.upsert({ id: uuid(), recipeInstallId, category, amount })
  return resp[0]
}

const listBudgets = async (recipeInstallId) =>
  await budget.findAll({ where: { recipeInstallId } })

module.exports = { Budget: budget, upsertBudget, listBudgets }
