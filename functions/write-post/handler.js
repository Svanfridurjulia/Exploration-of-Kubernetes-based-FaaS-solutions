'use strict'

const AWS = require('aws-sdk');
const fs = require('fs');

// Configure AWS SDK
AWS.config.region = 'eu-west-1';
AWS.config.credentials = new AWS.EC2MetadataCredentials();

const crypto = require('crypto');

//Client for reading from tables
const dynamoDb = new AWS.DynamoDB.DocumentClient();
//Client for writing to table
const db = new AWS.DynamoDB();

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
        const response = {
            statusCode: 204,
            headers: headers,
            body: '',
        };
        return response;
    }

    //Check if the event.body is missing or is empty
    if (!event.body || Object.keys(event.body).length === 0) {
        const response = {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify({ message: "Missing request body" }),
        };
        return response;
    }


    // Get the postText and username from the request body
    const postText = event.body.post_text;
    const username = event.body.username;

    //Check if either postText or username is missing from the request
    if (!postText || !username) {
      //If postText or Username is missing, return 400 Bad Request response
        const response = {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify({ message: "Missing post data" }),
        };
        return response;
    }

    //Get the user item from the users table
    const user = await getUser(username);

    if (!user) {
      // If user object is not found, return 404 Not Found response
        const response = {
            statusCode: 404,
            headers: headers,
            body: JSON.stringify({ message: `User with username ${username} not found` }),
        };
        return response;
    }

    //Get the user id from the user item
    const userId = user.user_id;


    //Get the last used post id  
    const newPostId = await getPostId();

    // Create the post item and put it into the Posts table
    var params = {
      TableName: 'posts',
      Item: {
        'post_id' : {N: newPostId.toString()},
        'post_date' : {S: Date.now().toString()},
        'post_text': {S: postText},
        'user_id': {N: userId.toString()}
      }
    };

    db.putItem(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        const response = {
          statusCode: 400,
          headers: headers,
          body: 'Could not add post to table',
          };
          return response;
      } else {
        console.log("Success", data);
      }
    });


    const response = {
      statusCode: 200,
      headers: headers,
      body: 'Post added sucessfully',
      };
      return response;

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
    throw error;
  }
};


/**
 * Retrieves the last used post id from the DynamoDB database
 * @returns {number} the id to be used for the new post item.
 */
const getPostId = async () => {
  const params = {
    TableName: 'posts',
    ProjectionExpression: 'post_id',
    Limit: 1,
    ScanIndexForward: false, // sort in descending order
  };

  const result = await dynamoDb.scan(params).promise();
  console.log(result);

  if (!result.Items[0]) {
    return 0;
  }
  const lastId = result.Items[0].post_id;
  
  return lastId + 1;

}