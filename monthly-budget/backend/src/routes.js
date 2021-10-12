const { Router } = require("express")
const httpStatus = require('http-status')

const router = Router()

router.get("/", async (req, resp) => {
  return resp.status(httpStatus.OK).json({ foo: 'bar' })
})

module.exports = { router }
