const { Router } = require("express")
const axios = require('axios')
const httpStatus = require('http-status')
const AlloyJS = require("@alloycard/alloy-js")
const { addAutomation, listAutomation } = require("./controllers/Automation")
const { execAutomation } = require("./controllers/Webhook")
const { listCategories } = require("./controllers/Categories")
const Automation = require('./models/Automation')
const { klutchServerUrl } = require("../config")

const router = Router()
AlloyJS.configure({ serverUrl: klutchServerUrl })

router.get("/category", listCategories)
router.get("/automation", listAutomation)
router.post("/automation", addAutomation)
router.post("/webhook", execAutomation)

router.get("/health", async (req, resp) => {
  let responseStatus = httpStatus.OK
  let services = {
    // klutchServer: {
    //   success: true,
    //   errorMessage: null,
    // },
    database: {
      success: true,
      errorMessage: null,
    },
  }

  // TODO fix klutchServerUrl
  // await axios({ method: 'get', url: `${klutchServerUrl}/healthcheck`, })
  //   .catch(function (error) {
  //     services.klutchServer.success = false
  //     services.klutchServer.errorMessage = "klutch server comunication fail"
  //     responseStatus = httpStatus.SERVICE_UNAVAILABLE
  //     console.log(services.klutchServer.errorMessage, error)
  //   })

  if (Automation.collection.conn._readyState !== 1) {
    services.database.success = false
    services.database.errorMessage = "database connection fail"
    responseStatus = httpStatus.SERVICE_UNAVAILABLE
    console.log(services.klutchServer.errorMessage)
  }

  return resp.status(responseStatus).json({ services })
})

module.exports = { router }
