require('dotenv').config({ path: process.env.NODE_ENV === 'test' ? ".env.test" : ".env" })
const throwMissingVariable = (name) => { throw new Error(`missing required env variable "${name}"`) }

const config = {
  klutchServerUrl: process.env.KLUTCH_SERVER_URL || throwMissingVariable('KLUTCH_SERVER_URL'),
  klutchPublicKey: process.env.KLUTCH_PUBLIC_KEY || throwMissingVariable('KLUTCH_PUBLIC_KEY'),
  port: process.env.PORT || 3003,
}

module.exports = { ...config }
