const axios = require('axios')
const { Router } = require("express")
const httpStatus = require('http-status')
const { klutchServerUrl } = require("../config")

const router = Router()

router.get("/health", async (req, resp) => {
  let responseStatus = httpStatus.OK
  let services = {
    klutchServer: {
      success: true,
      errorMessage: null,
    },
  }

  await axios({ method: 'get', url: `${klutchServerUrl}/healthcheck`, })
    .catch(function (error) {
      services.klutchServer.success = false
      services.klutchServer.errorMessage = "klutch server comunication fail"
      responseStatus = httpStatus.SERVICE_UNAVAILABLE
      console.log(services.klutchServer.errorMessage, error)
    })

  // TODO
  // check database

  return resp.status(responseStatus).json({ services })
})

module.exports = { router }
