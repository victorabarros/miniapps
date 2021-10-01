const express = require('express')
const mongoose = require('mongoose')
const { router } = require('./routes')
const { mongoUrl, mongoDbName, port } = require('../config')

const app = express()

app.use(express.json())
app.use(router)

mongoose.connect(
  mongoUrl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: mongoDbName
  }
)

app.listen(port, () => console.log(`\nServer is running on port ${port}`))
