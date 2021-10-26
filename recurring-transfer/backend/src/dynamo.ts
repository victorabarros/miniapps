var {DynamoDB} = require('aws-sdk')    
    
var dynamoDb = new DynamoDB.DocumentClient({
    region: process.env.AWS_REGION
});


exports.insert = async (table: string, item:any) => {
    var params = {
        TableName:table,
        Item: item
    }    

    return new Promise((res, rej) => {        
        dynamoDb.put(params, function(err: any, data: any) {
            if (err) {
                rej(err)
            } else {
                res(data)
            }
        }) 
    })
}

exports.findById = async (table: string, id: any, secondary: string) => {
    var params = {
        TableName:table,
        Key: id
    }    

    return new Promise((res, rej) => {
        dynamoDb.get(params, function(err: any, data: any) {
            if (err) {
                rej(err)
            } else {
                res(data)
            }
        })
    })
}

exports.query = async (table: string, id: any) => {
    var params = {
        ExpressionAttributeValues: {
         ":recipeInstallId": id
        },         
        KeyConditionExpression: "recipeInstallId = :recipeInstallId",         
        TableName: table
       };    

    return new Promise((res, rej) => {
        dynamoDb.query(params, function(err: any, data: any) {
            if (err) {
                rej(err)
            } else {
                res(data)
            }
        })
    })
}

exports.scan = async (table: string ) => {
    var params = {
        FilterExpression: "deleted = :deleted",
        TableName: table,
        ExpressionAttributeValues: {
            ":deleted": false
        }
       };    

    return new Promise((res, rej) => {
        dynamoDb.scan(params, function(err: any, data: any) {
            if (err) {
                rej(err)
            } else {
                res(data)
            }
        })
    })
}
