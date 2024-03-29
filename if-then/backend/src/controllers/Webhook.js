const { BuildJWTToken } = require("./helper")
const {
  AlloyJS,
  RecipesService,
  GraphQLService,
  TransactionService,
  CardsService,
  Entity
} = require("@klutchcard/alloy-js")
const httpStatus = require('http-status');
const Automation = require('../models/Automation')
const { transactionEventType, klutchServerUrl, recipeId } = require('../../config')
const Ajv = require("ajv")

AlloyJS.configure({ serverUrl: klutchServerUrl })

const ajv = new Ajv()
let categories = null
let transaction
let recipeInstallId

const validate = ajv.compile({
  type: "object",
  properties: {
    principal: {
      type: "object",
      properties: {
        _alloyCardType: { type: "string" },
        entityID: { type: "string" },
      },
      required: ["_alloyCardType", "entityID"],
    },
    event: {
      type: "object",
      properties: {
        _alloyCardType: { type: "string" },
        createdAt: { type: "integer" },
        eventId: { type: "string" },
        transaction: {
          type: "object",
          properties: {
            _alloyCardType: { type: "string" },
            entityID: { type: "string" },
          },
          required: ["_alloyCardType", "entityID"],
        },
      },
      required: ["transaction"],
    },
    webhookUrl: { type: "string" },
  },
  required: ["principal", "event"],
})

const execAutomation = async (req, resp) => {
  console.log("POST /webhook started")

  const valid = validate(req.body)
  if (!valid) {
    return resp.status(httpStatus.BAD_REQUEST).json({ errorMessage: validate.errors })
  }

  const { event, principal } = req.body
  if (!event || !principal) {
    console.log(`payload is missing event or principal objects`)
    return resp.status(httpStatus.BAD_REQUEST).json()
  }

  recipeInstallId = principal.entityID

  if (event._alloyCardType !== transactionEventType) {
    console.log(`event type "${event._alloyCardType} hasn't a handler`)
    return resp.status(httpStatus.OK).json()
  }

  let automation

  try {
    automation = (await Automation.findOne({ recipeInstallId })) || { _doc: { rules: {} } }
  } catch (err) {
    console.log({ err, recipeInstallId })
    return resp.status(httpStatus.SERVICE_UNAVAILABLE).json({ errorMessage: "Database connection error" })
  }

  const { rules } = automation._doc
  console.log(`recipeInstall "${recipeInstallId}" has "${Object.keys(rules).length}" rules`)

  const jwtToken = BuildJWTToken()
  GraphQLService.setAuthToken(jwtToken)

  try {
    const recipeInstallToken = await RecipesService.getRecipeInstallToken(recipeInstallId)
    GraphQLService.setAuthToken(recipeInstallToken)

    transaction = await TransactionService.getTransactionDetails(event.transaction.entityID)

    const entity = new Entity({
      type: "com.alloycard.core.entities.transaction.Transaction",
      entityID: transaction.id,
    })

    RecipesService.addPanel(
      recipeInstallId,
      "/templates/TransactionPanel.template",
      { recipeId, merchantName: transaction.merchantName },
      entity
    )

    await Promise.all(Object.values(rules).map(handleRule))
  } catch (err) {
    console.log({ err, recipeInstallId, transactionId: event.transaction.entityID })
    return resp.status(httpStatus.INTERNAL_SERVER_ERROR).json({ errorMessage: err.message })
  }

  console.log("POST /webhook finished with success")
  return resp.status(httpStatus.OK).json()
}

const handleRule = async ({ condition, action }) => {
  const entity = new Entity({
    type: "com.alloycard.core.entities.transaction.Transaction",
    entityID: transaction.id,
  })

  if (!verifyCondition(condition, transaction)) {
    return
  }

  console.log(`applying rule "${condition.key}-${condition.value}", action "${action.key}" on transaction ${transaction.id}`)
  await applyAction(action, transaction)

  RecipesService.addPanel(
    recipeInstallId,
    "/templates/TransactionPanel.template",
    { condition, action },
    entity
  )
}

const verifyCondition = ({ key, value }, trx) => conditions[key](value, trx)
const conditions = {
  merchantAmount: (value, trx) => (trx.amount > value),
  merchantName: (value, trx) => (trx.merchantName.toUpperCase().includes(value.trim().toUpperCase())),
  merchantCategory: (value, trx) => (trx.category?.name.toUpperCase().includes(value.trim().toUpperCase())),
  accountBalance: (value, trx) => { throw new Error("Condition accountBalance not implemented yeat") },
}

const applyAction = ({ key, value }, trx) => actions[key](value, trx)
const actions = {
  categorizeTransaction: async (value, trx) => {
    if (!categories) {
      categories = await TransactionService.getTransactionCategories()
    }
    const { id } = categories.find(({ name }) => name.toUpperCase() == value.toUpperCase())

    console.log(`categorizing transaction "${trx.id}" to "${value}"`)

    await TransactionService.categorizeTransaction(trx.id, id)
  },
  freezeCard: async (value, trx) => { await CardsService.lock(trx.card) },
  sendNotification: (value, trx) => { throw new Error("Action sendNotification not implemented yeat") },
  makeDeposit: (value, trx) => { throw new Error("Action makeDeposit not implemented yeat") },
  // TODO:
  // - rename merchant
  // - split transaction
}

module.exports = { execAutomation }
