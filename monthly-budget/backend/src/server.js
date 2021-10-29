const { AlloyJS } = require("@klutchcard/alloy-js")
const express = require('express')
const { router } = require('./routes')
const { port, klutchServerUrl, klutchPublicKey } = require('../src/config/config')
require('./database')

const app = express()
app.use(express.json())
app.use(router)

AlloyJS.configure({ serverUrl: `${klutchServerUrl}/graphql`, klutchPublicKey })

app.listen(port, () => console.log(`\nServer is running on port ${port}`))
