import express, { NextFunction, Request, Response } from "express"
import httpStatus from "http-status"
import {
  GraphQLService,
  RecipesService,
  AlloyJS,
} from "@klutchcard/alloy-js"
import { sign, verify } from 'jsonwebtoken'
import Resource from "./models/Resource"

// TODO move to env
const port = 3004
const recipeInstallCreatedEventType = "com.alloycard.core.entities.recipe.RecipeInstallCreatedEvent"
const recipeId = ""
const klutchServerUrl = "https://sandbox.klutchcard.com"
const klutchPublicKey = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA68vuDInRI2B9gJsoYQfk\nC+7LyLjiye7iyOACXjCHGXF3yyYhTj8aKp5x6EDZHSupnuLd2kaNoWfu5oMHP1Nm\noU0Sx6z40cuO4fDk1SVswl+Ptv10L9zQjfhVaog9DbyKB9nCyIf9fYsphIQtpWfu\n3MkXgvvUKUR41hJOkM2d6jpH7k3wrgFfztGxTiDLAtb3HZk+QU2V0C6VBB6Uev/8\noZuG6GH8bwGCr68rTrUaDzD5MgVtLv9c7em+ZxXuSS1eS1thkCZaHnjoD2AjvheK\nDDFbFzAribqyPE+BFxhy8bLuAnQodQ1eISCel3AOsPzLHROtKIODmVVVBSZL27RV\nzwIDAQAB\n-----END PUBLIC KEY-----"
const privateKey = ""

AlloyJS.configure({
  serverUrl: `${klutchServerUrl}/graphql`,
  jwtService: { sign, verify },
  klutchPublicKey,
})

const middleware = (req: Request, res: Response, next: NextFunction) => {
  const { method, url } = req

  console.log(`[${new Date().toISOString()}] ${method} "${url}" started`)
  //   TODO check authorization

  next()
}

const healthCheckController = async (req: Request, res: Response) =>
  res.status(httpStatus.OK).json({ health: "check" })

const listResourcesController = async (req: Request, res: Response) => {
  const resources = await Resource.list()

  return res.status(httpStatus.OK).json({ resources })
}

const insertResourceController = async (req: Request, res: Response) => {
  const { name, value } = req.body
  const resources = await Resource.insert({ id: '004', name, value })

  return res.status(httpStatus.CREATED).json({ resources })
}

const webhookController = async (req: Request, res: Response) => {
  const { event, principal } = req.body

  if (!event || !principal) {
    return res.status(httpStatus.BAD_REQUEST).json()
  }

  const recipeInstallId = principal.entityID

  if (event._alloyCardType === recipeInstallCreatedEventType) {
    console.log(`adding home panel to recipeInstallId \"${recipeInstallId}\"`)

    GraphQLService.setAuthToken(RecipesService.buildRecipeToken(recipeId, privateKey))

    try {
      const recipeInstallToken = await RecipesService.getRecipeInstallToken(recipeInstallId)
      GraphQLService.setAuthToken(recipeInstallToken)
      await RecipesService.addPanel(recipeInstallId, "/templates/Home.template", {}, null)
      return res.status(httpStatus.OK).json()
    } catch (err) {
      console.log({ err, recipeInstallId })
      return res.status(httpStatus.SERVICE_UNAVAILABLE).json({ error: "Fail to request to graphql api" })
    }
  }
}

express()
  .use(middleware)
  .use(express.json())
  .get('/health', healthCheckController)
  .get('/resource', listResourcesController)
  .post('/resource', insertResourceController)
  .post('/webhook', webhookController)
  .listen(port, () => console.log(`runnnig on port ${port}`))
