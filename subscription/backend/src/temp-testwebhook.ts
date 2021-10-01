require('dotenv').config()
var app = require("./app.js")

const message = {
    body: `{
        "principal": {
            "_alloyCardType": "com.alloycard.core.entities.recipe.RecipeInstall",
            "entityID": "d15046e6-0973-4a6f-85b6-335eceb6525f"
        },
        "event": {
            "_alloyCardType": "com.alloycard.core.entities.transaction.TransactionCreatedEvent",
            "transaction": {
                "_alloyCardType": "com.alloycard.core.entities.transaction.Transaction",
                "entityID": "1a6e14b8-7a1f-4aef-a56d-680b15c23e4c"
            },
            "createdAt": 1628551240,
            "eventId": "abd4eb21-8b69-41b2-bfc4-b5510d94a33f"
        },
        "webhookUrl": "https://gmmfhy4rr0.execute-api.us-west-2.amazonaws.com/klutch-webhook"
    }`    
}



const subMessage = {
    version: '2.0',
    routeKey: 'GET /subscriptions',
    rawPath: '/subscriptions',
    rawQueryString: '',
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-encoding': 'gzip',
      authorization: 'Bearer eyJraWQiOiJmYTQxYzE0MC05ZjFkLTQ2M2QtODIzMC0xNDAzOGU4M2E3MzAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJjdXN0b206cHJpbmNpcGFsSWQiOiJkMTUwNDZlNi0wOTczLTRhNmYtODViNi0zMzVlY2ViNjUyNWYiLCJpc3MiOiJodHRwczovL2NvZ25pdG8taWRwLnVzLXdlc3QtMi5hbWF6b25hd3MuY29tL3VzLXdlc3QtMl9HTWh5THc1dkEiLCJjdXN0b206cHJpbmNpcGFsVHlwZSI6ImNvbS5hbGxveWNhcmQuY29yZS5lbnRpdGllcy5yZWNpcGUuUmVjaXBlSW5zdGFsbCIsImV4cCI6MTYyODU1ODQxMX0.XpJ58MwXmaE-f1bOrh--4RaZRp_aqtg_9yE55Nd47kTLZBACZV6hDL3GInJK3Ld0_SfHWLnm0hoIk72GhvUUZf4_gyAdiAyFLzlQbdEzyxGqFs3wpuTZUKTp6R2jrCkatqGYFL1nCpe0LMX7A3BWIlIHDa-3Oxtd-MZfWbg-fU7X5UX6rWlLPVMzRzY5-tbsE7IcIBekcc4aao6aeJyNH6uJDH3m4iS3s8TP4MH656TaWxD9lTMnyjN_ivBM2S1U0psd7k1fNLH6rpYkVDJI6qsLoqUkdxvGyEZEoxHqaejYGv1AQZeN56IU4iKF43H4YiwEs0_jMAd_lfMnUBA9EA',
      'content-length': '0',
      host: 'gmmfhy4rr0.execute-api.us-west-2.amazonaws.com',
      'user-agent': 'okhttp/3.14.9',
      'x-amzn-trace-id': 'Root=1-6111d410-1d3aa0180705fd8373ab70ad',
      'x-forwarded-for': '209.107.188.129',
      'x-forwarded-port': '443',
      'x-forwarded-proto': 'https'
    },
    requestContext: {
      accountId: '133419881088',
      apiId: 'gmmfhy4rr0',
      domainName: 'gmmfhy4rr0.execute-api.us-west-2.amazonaws.com',
      domainPrefix: 'gmmfhy4rr0',
      http: {
        method: 'GET',
        path: '/subscriptions',
        protocol: 'HTTP/1.1',
        sourceIp: '209.107.188.129',
        userAgent: 'okhttp/3.14.9'
      },
      requestId: 'D04SihlnvHcEJKw=',
      routeKey: 'GET /subscriptions',
      stage: '$default',
      time: '10/Aug/2021:01:19:12 +0000',
      timeEpoch: 1628558352006
    },
    isBase64Encoded: false
  }


async function run () {
    const resp = await app.klutchWebhook(message)
    console.log(resp)
}


async function run2() {
    const resp = await app.getSubscriptions(subMessage)
    console.log(resp)
}

run2()



