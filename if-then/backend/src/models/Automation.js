const mongoose = require('mongoose')

const AutomationSchema = new mongoose.Schema(
  {
    recipeInstallId: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },
    rules: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }, { strict: false }
)

module.exports = mongoose.model('Automation', AutomationSchema)
