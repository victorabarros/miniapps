const { RecipesService } = require("@klutchcard/alloy-js");
const httpStatus = require('http-status')
const Ajv = require("ajv")
const { Budget } = require("../models/Budget")
const { v4: uuid } = require("uuid")


const ajv = new Ajv()

const validate = ajv.compile({
  type: "object",
  properties: {
    amount: { type: "number" },
    category: { type: "string" },
  },
  required: ["amount", "category"],
})

const getRecipeInstallId = (token) => {
  const decodedToken = RecipesService.decodeJwtToken(token.substr(7))
  return decodedToken["custom:principalId"]
}

const addBudget = async (req, resp) => {
  console.log("POST /budget started")

  let recipeInstallId
  try {
    recipeInstallId = getRecipeInstallId(req.headers.authorization)
  } catch (err) {
    console.log({ err })
    return resp.status(httpStatus.UNAUTHORIZED).json({ errorMessage: "Invalid token" })
  }

  if (!validate(req.body)) {
    return resp.status(httpStatus.BAD_REQUEST).json({ errorMessage: validate.errors })
  }

  const { category, amount } = req.body

  try {
    const row = await Budget.create({ id: uuid(), recipeInstallId, category, amount })
    console.log("POST /budget finished with success")
    return resp.status(httpStatus.CREATED).json(row)
  } catch (err) {
    console.log({ err })
    return resp.status(httpStatus.SERVICE_UNAVAILABLE).json({ errorMessage: 'fail in insert to database' })
  }
}

module.exports = { addBudget }
