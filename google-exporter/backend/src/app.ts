import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import {SecretsManager} from "aws-sdk"
import { setImmediate } from "timers";
import {Transaction} from "@klutchcard/alloy-js"


const axios = require('axios').default;
const sheets = require('./sheets.js');
const dynamo = require('./dynamo.js')
const alloy = require('./alloy.js')

const secretManager = new SecretsManager({region: process.env.AWS_REGION});


export const handleWebhook = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {    

    

    if (!event.body) {
        return {
            statusCode: 400,
            body: "Body cannot be null"   
        }
    }    
    
    const alloyEvent = JSON.parse(event.body)
    console.log("New Message:", JSON.stringify(alloyEvent))

    const alloyKey = process.env.klutchKey
    const recipeId = process.env.recipeId
    const tableName = process.env.AccessTokenTable
    const secret = JSON.parse(await getSecret("/google/oauth"))
    const client_id = secret.client_id
    const client_secret = secret.client_secret

    
    if (alloyEvent.event._alloyCardType == "com.alloycard.core.entities.transaction.TransactionCreatedEvent" || 
        alloyEvent.event._alloyCardType == "com.alloycard.core.entities.transaction.TransactionUpdatedEvent") {
        const recipeInstallId = alloyEvent.principal.entityID        
        const t: Transaction = await alloy.getTransactionDetails(alloyKey, recipeId, recipeInstallId, alloyEvent.event.transaction.entityID)
        if (t.transactionStatus != "SETTLED") {
            return {
                statusCode: 200,
                body: "{}"
            }            
        }

        const googleCredentials = await dynamo.findById(tableName, recipeInstallId)
        const params = new URLSearchParams()
        params.append('client_id',client_id)
        params.append('client_secret',client_secret)
        params.append('grant_type',"refresh_token")
        params.append('refresh_token', googleCredentials.Item.refresh_token)
    
    
    
        const resp = await axios.post('https://oauth2.googleapis.com/token', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }); 


        const row = [t.transactionDate, t.card?.name || "", t.merchantName, t.amount, t.category?.name || "", t.transactionType, t.transactionStatus, t.streetAddress, t.city, t.state, t.zipCode]
        const sheetRow = await sheets.insertLine(resp.data, googleCredentials.Item.sheetId, row)
        const panel = await alloy.addTransactionPanel(alloyKey, recipeId, recipeInstallId, "/templates/Transaction.template", {transaction: t, ...sheetRow}, t.id)        
        return {
            statusCode: 200,
            body: JSON.stringify(panel)
        }    
    }
    return {
        statusCode: 200,
        body: "{}"
    }    
}

const getSecret =  async(secretName: string): Promise<string> => {
    return new Promise((res, rej) => {
        secretManager.getSecretValue({SecretId: secretName}, function(err, data) {
            if (err) {
                rej(err)
            }
            else {
                res(data.SecretString as string)
            }
        });
    })
}

export const oauthRedirect = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>  {    
    const secret = JSON.parse(await getSecret("/google/oauth"))
    const client_id = secret.client_id
    const client_secret = secret.client_secret

    const tableName = process.env.AccessTokenTable
    const recipeId = process.env.recipeId
    const alloyKey = process.env.klutchKey


    console.log("EVENT", event)

    if (!event.queryStringParameters) {
        return {
            statusCode: 500,
            body: "QueryString params are null"            
        }
    }

    const redirect_uri = `https://${event.headers.host}/oauth-redirect`
    const code = event.queryStringParameters["code"] || ""
    const state = JSON.parse(event.queryStringParameters["state"] || "")
    console.log("STATE",setImmediate)

    const params = new URLSearchParams()
    params.append('client_id',client_id)
    params.append('client_secret',client_secret)
    params.append('code',code)
    params.append('grant_type',"authorization_code")
    params.append('redirect_uri', redirect_uri)



    const resp = await axios.post('https://oauth2.googleapis.com/token', params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });   

    const headers = ["Date", "Card",  "Merchant", "Amount", "Category", "Type", "Status", "Street", "City", "State", "Zip Code"]

    const sheet = await sheets.createSheet(resp.data, state.sheetName, headers)

    if (resp.refresh_token) {
        await dynamo.insert(tableName, {id: state.recipeInstallId,  sheetId: sheet.spreadsheetId,   ...resp.data})     
    } else {
        const googleCredentials = await dynamo.findById(tableName, state.recipeInstallId)
        await dynamo.insert(tableName, {id: state.recipeInstallId,  sheetId: sheet.spreadsheetId,   ...googleCredentials.Item})     
    }
    
    

    const transactions: Transaction[] = await alloy.getAllTransactions(alloyKey, recipeId, state.recipeInstallId)
    
    const newSheet = sheet.sheetsByIndex[0]
    for (let t of transactions) {
        await newSheet.addRow([t.transactionDate, t.card?.name || "", t.merchantName, t.amount, t.category?.name || "", t.transactionType, t.transactionStatus, t.streetAddress, t.city, t.state, t.zipCode]) 
    }
    await newSheet.saveUpdatedCells()

    return {
        'statusCode': 301,
        body: "redirecting...",
        headers: {
            Location: `klutch://klutch/miniapps/${recipeId}/Connected`
        }
    }
}

