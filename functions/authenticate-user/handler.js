'use strict'

const AWS = require('aws-sdk');
const fs = require('fs');

AWS.config.region = 'eu-west-1';
AWS.config.credentials = new AWS.EC2MetadataCredentials();

const crypto = require('crypto');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = async (event, context) => {
    console.log(event.body);
    const username = event.body.username;
    const password = event.body.password;

  try {
    const user = await getUser(username);
    if (!user) {
      const response = {
        statusCode: 400,
        body: JSON.stringify({ message: "invalid username and/or password" }),
      };
      return response;
    }

    const hashedPassword = hashPassword(password);

    if (hashedPassword === user.password) {
      const response = {
        statusCode: 200,
        body: JSON.stringify({ message: "authenticated" }),
      };
      return response;
    }
    
    const response = {
      statusCode: 401,
      body: JSON.stringify({ message: "not authenticated" }),
    };
    return response;

  } catch (error) {
    const response = {
      statusCode: 500,
      body: JSON.stringify({ message: "Error during authentication", errormessage: error }),
    };
    return response;
  }
};

function hashPassword(password) {
  return crypto
    .createHash("sha256")
    .update(password, "utf8")
    .digest("hex");
}

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
