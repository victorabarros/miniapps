const mongoose = require('mongoose')

const BurnerCardSchema = new mongoose.Schema(
  {
    recipeInstallId: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },
    cards: {
      type: [String],
      required: true,
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
)

module.exports = mongoose.model('BurnerCard', BurnerCardSchema)
