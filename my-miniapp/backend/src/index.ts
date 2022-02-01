import express, { NextFunction, Request, Response } from "express"
import httpStatus from "http-status"
import {
  GraphQLService,
  RecipesService,
  AlloyJS,
} from "@klutchcard/alloy-js"
import Resource from "./models/Resource"
import { BuildJWTToken } from "./helper"

// TODO move to env
const PORT = 3004
const RECIPEINSTALL_CREATED_EVENT = "com.alloycard.core.entities.recipe.RecipeInstallCreatedEvent"
const SERVER_URL = "https://sandbox.klutchcard.com"

AlloyJS.configure({
  serverUrl: `${SERVER_URL}/graphql`,
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
  const resources = await Resource.list()
  const resp = await Resource.insert({ id: resources.length.toString(), name, value })

  return res.status(httpStatus.CREATED).json({ resp })
}

const webhookController = async (req: Request, res: Response) => {
  const { event, principal } = req.body

  if (!event || !principal) {
    return res.status(httpStatus.BAD_REQUEST).json()
  }

  const recipeInstallId = principal.entityID

  if (event._alloyCardType === RECIPEINSTALL_CREATED_EVENT) {
    console.log(`adding home panel to recipeInstallId \"${recipeInstallId}\"`)

    const jwtToken = BuildJWTToken()
    GraphQLService.setAuthToken(jwtToken)

    try {
      const recipeInstallToken = await RecipesService.getRecipeInstallToken(recipeInstallId)
      GraphQLService.setAuthToken(recipeInstallToken)

      await RecipesService.addPanel(recipeInstallId, "/templates/Home.template", {}, undefined)

      // console.log(await RecipesService.getPanels(undefined))

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
  .listen(PORT, () => console.log(`runnnig on port ${PORT}`))
