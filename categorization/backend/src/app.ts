"use strict";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import Klutch from "./klutch.js";
import {  RecipesService,    TransactionService, TransactionStatus, TransactionType} from "@alloycard/alloy-js"
import  { DateTime } from "luxon"
import { TransactionCategory } from "@alloycard/alloy-js/lib/entities/TransactionCategory";
import { verify } from "jsonwebtoken";


const KLUTCH_PUBLIC_KEY: string = process.env.KlutchPublicKey || ""

type AmountPerCategory = {
    category: TransactionCategory, 
    amount: number, 
    count: number
}

async function getAmountPerCategory(recipeInstallId: string) {
    await Klutch.auth(recipeInstallId)
        
    const startDate = DateTime.now().startOf('month').toJSDate()
    const endDate = DateTime.now().endOf('month').toJSDate()
    const transactionData = await TransactionService.getTransactionsWithFilter({startDate, endDate, transactionTypes: [TransactionType.PAYMENT, TransactionType.REFUND], transactionStatus: [TransactionStatus.PENDING, TransactionStatus.SETLLED]})
    const uncategorized = {category: {id: "uncategorized", name: "UNCATEGORIZED"}, amount: 0, count: 0}

    const amountPerCategory: Array<AmountPerCategory> = transactionData.reduce((acc, curr) => {
            var currCat: AmountPerCategory | undefined
            if (!curr.category) {
                currCat = uncategorized
            } else {
                currCat = acc.find(c => c.category.id == curr.category.id)
            }
             
            if (!currCat) {
                acc.push({category: curr.category, amount: curr.amount,  count: 1})
            } else {
                currCat.amount += curr.amount                
                currCat.count++
            }                
        return acc
    }, [uncategorized] as Array<AmountPerCategory>)

    return amountPerCategory
}

export const handleWebhook = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {    

    if (!event.body) {
        return {
            statusCode: 400,
            body: "Body cannot be null"   
        }
    }    
    
    const alloyEvent = JSON.parse(event.body)
    console.log("New Message:", JSON.stringify(alloyEvent))
    var panel = {}

    if (alloyEvent.event._alloyCardType == "com.alloycard.core.entities.transaction.TransactionCreatedEvent" ||
        alloyEvent.event._alloyCardType == "com.alloycard.core.entities.transaction.TransactionUpdatedEvent" ) {
        const recipeInstallId = alloyEvent.principal.entityID  
                
        var amountPerCategory = await getAmountPerCategory(recipeInstallId)
        
        console.log(amountPerCategory)
        if (amountPerCategory.length > 0) {
            panel = await RecipesService.addPanel(recipeInstallId, "/templates/Home.template", {amountPerCategory}, null)       
        }         
        console.log("Finished")
    }
    return {
        statusCode: 200,
        body: JSON.stringify(panel)
    }
}

export const handleGetCategories = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {    


 
    var token = event.headers["authorization"] || ""
    if (token.startsWith("Bearer ")) {
        token = token.substr(7)
    }
    
    const jwt = verify(token, KLUTCH_PUBLIC_KEY, {algorithms: ["RS256"]}) as any
    const recipeInstallId = jwt["custom:principalId"]
    var amountPerCategory = await getAmountPerCategory(recipeInstallId)        
    if (amountPerCategory.length > 0) {
        await RecipesService.addPanel(recipeInstallId, "/templates/Home.template", {amountPerCategory}, null)       
    }  
    return {
        statusCode: 200,
        body: JSON.stringify(amountPerCategory)
    }
}
