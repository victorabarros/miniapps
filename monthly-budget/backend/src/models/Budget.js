const { Model, DataTypes } = require("sequelize")


class budget extends Model {
  static init(sequelize) {
    super.init({
      recipeInstallId: DataTypes.STRING,
      category: DataTypes.STRING,
      amount: DataTypes.DECIMAL,
    }, { sequelize })
  }
}

module.exports = { Budget: budget }
