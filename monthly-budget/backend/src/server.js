const express = require('express')
const { router } = require('./routes')
const { port } = require('../config')

const app = express()

app.use(express.json())
app.use(router)

app.listen(port, () => console.log(`\nServer is running on port ${port}`))
