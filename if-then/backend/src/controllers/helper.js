const { sign, verify } = require('jsonwebtoken');
const { recipeId, timeoutSec, privateKeyPath, klutchKeyPath } = require('../../config')

const BuildJWTToken = () => {
  const header = { algorithm: "RS256", keyid: `AlloyPrincipal-${recipeId}` }
  const payload = {
    exp: Math.floor(Date.now() / 1000) + timeoutSec,
    iat: Math.floor(Date.now() / 1000),
    iss: "AlloyCard",
    "custom:principalId": recipeId,
    "custom:principalType": "com.alloycard.core.entities.recipe.Recipe"
  }

  return sign(payload, privateKeyPath, header)
}

const DecodeToken = (jwtToken) => verify(jwtToken, klutchKeyPath, { algorithms: ["RS256"] })

module.exports = { BuildJWTToken, DecodeToken }
