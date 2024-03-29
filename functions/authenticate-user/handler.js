'use strict'

const AWS = require('aws-sdk');
const fs = require('fs');

// Configure AWS SDK
AWS.config.region = 'eu-west-1';
AWS.config.credentials = new AWS.EC2MetadataCredentials();

const crypto = require('crypto');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Export an asynchronous function that handles authentication requests
// Returns a response object with a status code and message.
module.exports = async (event, context) => {

    //Setting the CORS headers
    context.headerValues = {
        'Access-Control-Allow-Origin': 'http://web-app.fabulousasaservice.com',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': 'application/json'
    };
    const headers = {
        'Access-Control-Allow-Origin': 'http://web-app.fabulousasaservice.com',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': 'application/json'
    };

    // Check for the preflight request (OPTIONS method)
    if (event.method === 'OPTIONS') {
        console.log("returning")
        const response = {
            statusCode: 204,
            headers: headers,
            body: '',
        };
        return response;
    }

    //Checking if the event.body is empty
    if (!event.body || Object.keys(event.body).length === 0) {
        const response = {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify({ message: "Missing request body" }),
        };
        return response;
    }


    // Get the username and password from the request body
    const username = event.body.username;
    const password = event.body.password;


    // Checking if username and password are missing
    if (!username || !password) {
        const response = {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify({ message: "Missing username and/or password" }),
        };
        return response;
    }


    try {
      // Try to get the user object from the DynamoDB database
        const user = await getUser(username);
        if (!user) {
          // If user object is not found, return 400 Bad Request response
            const response = {
                statusCode: 400,
                headers: headers,
                body: JSON.stringify({ message: "invalid username and/or password" }),
            };
            return response;
        }

        // Hash the received passwrod
        const hashedPassword = hashPassword(password);

        // Compare the hashed password and the stored user password
        if (hashedPassword === user.password) {
            // If the passwords match, return 200 OK response
            const response = {
                statusCode: 200,
                headers: headers,
                body: JSON.stringify({ message: "authenticated" }),
            };
            return response;
        }
        
        // If the hashed password does not match the stored password, return 401 Unauthorized response
        const response = {
            statusCode: 401,
            headers: headers,
            body: JSON.stringify({ message: "not authenticated" }),
        };
        return response;

    // If there are any errors, return a 500 Internal Server Error response with the error message
    } catch (error) {
        const response = {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({ message: "Error during authentication", errorMessage: error }),
        };
        return response;
    }
};

/**
 * Hashes a password using the SHA256 algorithm
 * @param {string} password to hash
 * @returns {string} hashed passwrod
 */
function hashPassword(password) {
    return crypto
        .createHash("sha256")
        .update(password, "utf8")
        .digest("hex");
}

/**
 * Retrieves a user from the DynamoDB database based on username
 * @param {string} username of the user to retrieve
 * @returns {Promise<object|null>} a Promise that resolves with the user object or null if the user is not found.
 * @throws {Error} - If there is an error retrieving the user from DynamoDB.
 */
const getUser = async (username) => {
    const params = {
        TableName: "users",
        FilterExpression: "#user_name = :username",
        ExpressionAttributeNames: {
            "#user_name": "user_name",
        },
        ExpressionAttributeValues: {
            ":username": username,
        },
    };

  try {
      const result = await dynamoDb.scan(params).promise();
      return result.Items.length > 0 ? result.Items[0] : null;
    } catch (error) {
        console.error("Error finding user by username:", error);
        throw error;
    }
};
