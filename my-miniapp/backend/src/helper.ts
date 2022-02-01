const { sign, verify } = require('jsonwebtoken');

// TODO move to env
const RECIPE_ID = "39674c50-f244-4810-96e7-c4400134479b"
const PRIVATE_KEY = process.env.PRIVATE_KEY // TODO user nodemon in dev
const KLUTCH_PUBLIC_KEY = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA68vuDInRI2B9gJsoYQfk\nC+7LyLjiye7iyOACXjCHGXF3yyYhTj8aKp5x6EDZHSupnuLd2kaNoWfu5oMHP1Nm\noU0Sx6z40cuO4fDk1SVswl+Ptv10L9zQjfhVaog9DbyKB9nCyIf9fYsphIQtpWfu\n3MkXgvvUKUR41hJOkM2d6jpH7k3wrgFfztGxTiDLAtb3HZk+QU2V0C6VBB6Uev/8\noZuG6GH8bwGCr68rTrUaDzD5MgVtLv9c7em+ZxXuSS1eS1thkCZaHnjoD2AjvheK\nDDFbFzAribqyPE+BFxhy8bLuAnQodQ1eISCel3AOsPzLHROtKIODmVVVBSZL27RV\nzwIDAQAB\n-----END PUBLIC KEY-----"
const TIMEOUT_SEC = 30

const BuildJWTToken = (): string => {
  const header = { algorithm: "RS256", keyid: `AlloyPrincipal-${RECIPE_ID}` }
  const payload = {
    exp: Math.floor(Date.now() / 1000) + TIMEOUT_SEC,
    iat: Math.floor(Date.now() / 1000),
    iss: "AlloyCard",
    "custom:principalId": RECIPE_ID,
    "custom:principalType": "com.alloycard.core.entities.recipe.Recipe"
  }

  return sign(payload, PRIVATE_KEY, header)
}

const DecodeToken = (jwtToken: string) => verify(jwtToken, KLUTCH_PUBLIC_KEY, { algorithms: ["RS256"] })

export { BuildJWTToken, DecodeToken }
