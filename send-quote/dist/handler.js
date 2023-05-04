"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dynamoDB = new aws_sdk_1.default.DynamoDB.DocumentClient();
async function handle(event, context, callback) {
    let err;
    try {
        // Extract values from event
        const { id, name, email } = event;
        // Construct the object to be written to DynamoDB
        const item = {
            id,
            name,
            email
        };
        // Define the parameters for the DynamoDB put operation
        const params = {
            TableName: 'my-dynamodb-table',
            Item: item
        };
        // Write the item to DynamoDB
        await dynamoDB.put(params).promise();
        // Return success response
        const result = {
            statusCode: 200,
            body: 'Item added to DynamoDB'
        };
        callback(null, result);
    }
    catch (error) {
        // Return error response
        const result = {
            statusCode: 500,
            body: `Error writing to DynamoDB: ${error.message}`
        };
        callback(null, result);
    }
}
exports.handle = handle;
