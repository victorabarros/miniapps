import {DynamoDB}  from "aws-sdk"  
import { QueryOutput } from "aws-sdk/clients/dynamodb";
    
var dynamoDb = new DynamoDB.DocumentClient();


export default new class Db {
    insert = async (table: string, item: any) => {
        var params = {
            TableName:table,
            Item: item
        }    
    
        return new Promise((res, rej) => {
            dynamoDb.put(params, function(err, data) {
                if (err) {
                    rej(err)
                } else {
                    res(data)
                }
            }) 
        })
    }

    findById = async (table: string, id: string) => {
        var params = {
            TableName:table,
            Key: {id: id}
        }    
    
        return new Promise((res, rej) => {
            dynamoDb.get(params, function(err, data) {
                if (err) {
                    rej(err)
                } else {
                    res(data)
                }
            })
        })
    }

    query = async(table: string, conditions: string, params: {[key: string]: string}): Promise<QueryOutput> => {
        return new Promise((res, rej) => {
            dynamoDb.query({
                TableName: table,
                KeyConditionExpression: conditions,
                ExpressionAttributeValues: params            
            }, function(err, data) {
                if (err) {
                    rej(err)
                } else {
                    res(data)
                }
            })
        })
    }
    
}

