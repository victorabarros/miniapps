require('dotenv').config({ path: process.env.NODE_ENV === 'test' ? ".env.test" : ".env" })

const config = {
  port: process.env.PORT || 3003,
}

module.exports = { ...config }
