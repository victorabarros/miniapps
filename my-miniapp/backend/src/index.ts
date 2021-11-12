import express, { NextFunction, Request, Response } from "express"
import httpStatus from "http-status"
import Resource from "./models/Resource"

const port = 3004

const middleware = (req: Request, res: Response, next: NextFunction) => {
  const { method, url } = req

  console.log(`${new Date().toISOString()} ${method} "${url}" started`)
  //   TODO check authorization

  next()
}

const healthCheckController = async (req: Request, res: Response) => {
  return res
    .status(httpStatus.OK)
    .json({ health: "check" })
}

const listResourcesController = async (req: Request, res: Response) => {
  const resources = await Resource.list()

  return res
    .status(httpStatus.OK)
    .json({ resources })
}

const insertResourceController = async (req: Request, res: Response) => {
  const { name, value } = req.body
  const resources = await Resource.insert({ id: '004', name, value })

  return res
    .status(httpStatus.CREATED)
    .json({ resources })
}

express()
  .use(middleware)
  .use(express.json())
  .get('/health', healthCheckController)
  .get('/resource', listResourcesController)
  .post('/resource', insertResourceController)
  .listen(port, () => console.log(`runnnig on port ${port}`))
