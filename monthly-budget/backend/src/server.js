const { AlloyJS } = require("@klutchcard/alloy-js")
const express = require('express')
const { router } = require('./routes')
const { port, klutchServerUrl, klutchPublicKey } = require('../config')


const app = express()
AlloyJS.configure({ serverUrl: `${klutchServerUrl}/graphql`, klutchPublicKey })

app.use(express.json())
app.use(router)

app.listen(port, () => console.log(`\nServer is running on port ${port}`))
