import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import auth from "./auth"
const dynamo = require('./dynamo.js')
const {    
    v4: uuidv4,
  } = require('uuid');

export type RecurringTransfer = {    
    id: string,
    recipeInstallId: string,    
    type: "weekly" | "monthly" | "lowbalance",
    amount: number,
    lowbalanceAmount?: number
    day?: number
    deleted: boolean 
    transferSourceId: string
}

export const addRecurringTranfer = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        
    if (!event.body) {
        return {
            statusCode: 500,
            body: "body is null"            
        }
    }

    console.log("event", event)

    var token = event.headers["Authorization"] || event.headers["authorization"] || ""
    
    if (token.startsWith("Bearer ")) {
        token = token.substr(7)
    }
    const jwt = auth.auth(token)
    const recipeInstallId = jwt["custom:principalId"]

    const tablename = process.env.RecurringTableName
    
    const transfer = JSON.parse(event.body) as RecurringTransfer  
    transfer.recipeInstallId = recipeInstallId  
    transfer.id = uuidv4();
    transfer.deleted = false
    
    await dynamo.insert(tablename, transfer)
    
    return {
        statusCode: 200,
        body: JSON.stringify(transfer)
    }     
}
export const listRecurringTransfers = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        

    var token = event.headers["Authorization"] || event.headers["authorization"] || ""
    
    if (token.startsWith("Bearer ")) {
        token = token.substr(7)
    }
    const jwt = auth.auth(token)
    const recipeInstallId = jwt["custom:principalId"]

    const tablename = process.env.RecurringTableName
    
    
    const data = await dynamo.query(tablename, recipeInstallId)

    const transfers = data.Items.filter((c: RecurringTransfer) => !c.deleted)

    
    return {
        statusCode: 200,
        body: JSON.stringify(transfers)
    }     
}

export const deleteTransfer = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        
    if (!event.pathParameters) {
        return {
            statusCode: 500,
            body: "body is null"            
        }
    }

    var token = event.headers["Authorization"] || event.headers["authorization"] || ""
    
    if (token.startsWith("Bearer ")) {
        token = token.substr(7)
    }
    const jwt = auth.auth(token)
    const recipeInstallId = jwt["custom:principalId"]

    const transferId = event.pathParameters["transferId"] 

    const tablename = process.env.RecurringTableName
    
    
    const data = await dynamo.findById(tablename, {recipeInstallId, id: transferId})

    const transfer = data.Item
    transfer.deleted = true
    await dynamo.insert(tablename, transfer)

    return {
        statusCode: 200,
        body: "{}"
    }     
}

