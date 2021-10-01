const mongoose = require('mongoose')

const AutomationSchema = new mongoose.Schema({}, { strict: false })

module.exports = mongoose.model('Automation', AutomationSchema)
