import express, { NextFunction, Request, Response } from "express"
import httpStatus from "http-status"

const port = 3004

const middleware = (req: Request, res: Response, next: NextFunction) => {
  const { method, url } = req

  console.log(`${new Date().toISOString()} ${method} "${url}" started`)
  //   TODO check authorization

  next()
}

const health = async (req: Request, res: Response) => {
  return res
    .status(httpStatus.OK)
    .json({ health: "check" })
}

express()
  .use(middleware)
  .get('/health', health)
  .listen(port, () => console.log(`runnnig on port ${port}`))
