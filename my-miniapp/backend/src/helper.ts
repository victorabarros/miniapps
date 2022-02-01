const { sign, verify } = require('jsonwebtoken');

// TODO move to env
const RECIPE_ID = "39674c50-f244-4810-96e7-c4400134479b"
const PRIVATE_KEY = "-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEAxJM1f0uqOFkeW42/Zv3roH01ExZdTiBoN9jFCLqk6dnYiFKy\ns9VT/pqyHbq0F8DrOstG44+65IkQffXTDJfL/66nJ1/yJr+dqX804cEyF9PSJYE0\nqXCgVk2+X3Llk9jLnQMkZhDmC6PRWXCShg7Bw0QINKvQEaecS8tnW5xN8SAJaDyY\nrAX5a7h3M3KkZv0QzwsSji3qN3aPyYgHUlSw0Ul5ZSiNmE3LM4wNQOQG1Ad850Gq\nXCfnO44whux8x+VxJW/bDVhZU6QospdnaGrhvQPUnq0DgCdXIZANmCLqm7w7EnR/\nkLwHeHy3Mzt5fStFdLGDMVdwHNNMvgHI4FHA6wIDAQABAoIBAQC5ReoRLXalH1He\nhq4U21Re8kO41sZgYWj44gVrYccXZayRaChoGLPO72zbWmJtVPYgdwE8b/Z9ebYi\nkjQ11Uh/ltSS5vprjQSDgZKNCLM3A/04PhwtayqjzSiV+8vn2limhxSiYmEALYme\nW9yuH3B+ozt8sUctrKVCRtcG4D4R+TIH5TYLZMV4b9ZtDYCtdwtOGx59a106r/UG\nXbWUuUKFjQ8j2Y7pcxOPocHujHf4rqvKe/PYSLx6Z1h+60/WKbXL0Jbwsoq5qc86\nXT8vnEKgCLX92PMTnCMwD9afXO6p/W1tcgZClVvkkuSsAF0HKFlgrtiooL/WAhAr\nP/WR9sDRAoGBAOW3+n5vZwoUrB+4kctxv6pdvL1HbiNKcSoK1j699Va2bYjx582H\nQhHV8gZOW3x9m7wgpF7Zzy6RJYwNl8r/76oaGFjzqzJGI0lacSSEnPQ9wDqItbwU\nFaLFWCA6jF3pU2sp9IRlxNdiBSPZOL2365Fr6yPSCnx03RvXOszQhwdpAoGBANsQ\nhEo8T45u3o7ry3ee+Ulks21CGYGhSuBoVUEUD2qfFg75gZERduVfc/MT2FCxBDWt\nqV/uoYc/El8cZmzvbgV0KYnpVD9osjmsI69vKRWeWbIr0eq4avLFYmateYNnw08j\n0nHnjItevUOO+Qbpa5UttJMjkIm2QJNHDYlnty8zAoGAbxmbvKqEWwvEc1MAsDRD\nTlInhiOV0Nuf/4VeONoGXfm84A6e3XgdLCMc+o/LD1pwh3wCAx20ZgEs959bWoKN\nlucn/11Z3uatCj0Dm3XHsxhqb+TOgDf2ftKS3IN0f7bo8VtJNv9BRCnT8pKMLrVU\n6PAYuSpMiAS9K0nc1lHD/IECgYB0uHU0NLRS+OHeluZfgzXiFCTCF1ENz8ncjdq3\nBSA9uCwBqJGPoRWPm29lWfKM8/SBQVmYwsYQENwSD0jHzD776uvjDo6UBo3Hyt9s\nrzbdzPSPyWdcwAxD9EW83bt794KKHVUY2b352G3RnFE1jJOE9chcCbwOlCwODPK6\nfqeNHwKBgQCs/gIzN5nypSK1ekQhFRR/g0RBSvg4gMMXa1CuIos6kxBnf2eLCUEd\nsPQ23oGJNwcPhUFcjPTegKg7CspnJZ3DLF7WqWMaGL4ripThHA+CmFuFAn+UjLh4\nRixTjqY0gStTLSVgCKO90ggZw2H3IqBdCdc7ERdPYDo1PVa/ytP17A==\n-----END RSA PRIVATE KEY-----"
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
