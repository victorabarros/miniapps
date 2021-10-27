import {addRecurringTranfer, listRecurringTransfers, deleteTransfer} from "../recurringtransfer"

import Klutch from '../klutch.js'

const recipeInstallId = process.env.testRecipeInstallId || ""

var chai = require("chai")

describe('Tests RecurringTransfer', function () {

    it("New Recurring", async () => {      
      const recurring = JSON.stringify({
          type:"monthly",
          amount: 15,
          day: 5
      })
      
      const jwt = await Klutch.auth(recipeInstallId)
      
      
      var resp = await addRecurringTranfer({
        headers: {
          Authorization: `Bearer ${jwt}`
        },
        body: recurring
      } as any)
      chai.expect(resp.statusCode).to.be.equal(200)
    })

    it("List Recurring", async () => {      
      const recurring = JSON.stringify({
          type:"monthly",
          amount: 15,
          day: 5
      })
      
      const jwt = await Klutch.auth(recipeInstallId)
      
      
      var resp = await listRecurringTransfers({
        headers: {
          Authorization: `Bearer ${jwt}`
        },
        body: recurring
      } as any)
      chai.expect(resp.statusCode).to.be.equal(200)
    })

    it("delete", async () => {      
      const recurring = JSON.stringify({
        type:"monthly",
        amount: 15,
        day: 5
    })
    
    const jwt = await Klutch.auth(recipeInstallId)
    
    
    var resp = await addRecurringTranfer({
      headers: {
        Authorization: `Bearer ${jwt}`
      },
      body: recurring
    } as any)

    var newTransfer = JSON.parse(resp.body)
    console.log("NEW TRANSFER", newTransfer)

    await deleteTransfer({
      headers: {
        Authorization: `Bearer ${jwt}`
      },
      pathParameters: {
        transferId: newTransfer.id
      }      
    } as any)

      chai.expect(resp.statusCode).to.be.equal(200)
    })

});