import {processTransfers, lowBalanceWebhook} from "../app"

import Klutch from '../klutch.js'

const recipeInstallId = process.env.testRecipeInstallId || ""

var chai = require("chai")


const recipeInstall = process.env.testRecipeInstallId

const exampleBalanceEvent = {
    "principal": {
      "_alloyCardType": "com.alloycard.core.entities.recipe.RecipeInstall",
      "entityID": recipeInstall
    },
    "event": {
      "_alloyCardType": "com.alloycard.core.entities.account.AccountBalanceChangedEvent",
      "account": {
        "_alloyCardType": "com.alloycard.core.entities.account.Account",
        "entityID": "e666cc94-42b5-4176-88e2-8011f6ab0a11"
      },
      "createdAt": 1629835288,
      "eventId": "01ad935f-a162-4be5-985e-870de23e1f97"
    },
    "webhookUrl": "https://recurring.url/webhook"
  }

describe('Tests ProcessTransfers', function () {

    it("Process", async () => {      
        const resp = await processTransfers()
    })

    it("Webhook", async () => {
        const balance = JSON.stringify(exampleBalanceEvent)
        var resp = await lowBalanceWebhook({
           body: balance
       } as any)
       chai.expect(resp.statusCode).to.be.equal(200)  
    })
});