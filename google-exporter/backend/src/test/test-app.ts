import {expect} from "chai";
import {handleWebhook} from "../app.js"



const recipeInstall = process.env.testRecipeInstallId

const exampleTransactionEvent = {
    "principal": {
      "_alloyCardType": "com.alloycard.core.entities.recipe.RecipeInstall",
      "entityID": recipeInstall
    },
    "event": {
      "_alloyCardType": "com.alloycard.core.entities.transaction.TransactionCreatedEvent",
      "transaction": {
        "_alloyCardType": "com.alloycard.core.entities.transaction.Transaction",
        "entityID": "ae501df3-ef37-4182-ac65-4ff86ac174a4"
      },
      "createdAt": 1629835288,
      "eventId": "01ad935f-a162-4be5-985e-870de23e1f97"
    },
    "webhookUrl": "https://categorization.url/webhook"
  }

describe('Tests SubscriptionManager', function () {

    it("Transaction received on Webhook", async () => {        
        const transaction = JSON.stringify(exampleTransactionEvent)
         var resp = await handleWebhook({
            body: transaction
        } as any)
        expect(resp.statusCode).to.be.equal(200)                
    })       
});