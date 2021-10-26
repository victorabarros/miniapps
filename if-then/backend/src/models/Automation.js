const mongoose = require('mongoose')

const AutomationSchema = new mongoose.Schema(
  {
    _id: false,
    recipeInstallId: {
      type: String,
      unique: true,
      index: true,
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
