'use strict'

const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-west-1' });
const crypto = require('crypto');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = async (event, context) => {
  
    // const jsonString = event;
    // const { username, password } = JSON.parse(jsonString);
    // console.log(username, password);
    // console.log(event);
    // const jsonObj = JSON.parse(event.body);
    // const username = jsonObj.username;
    // const password = jsonObj.password;
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
      body: JSON.stringify({ message: "Error during authentication" }),
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







// {
//   "password": "fff2d2061f065e218dd14f7d599a3881d1bee2092a02c72e9a786937fe847ac8",
//   "user_id": 8,
//   "full_name": "Svansa",
//   "user_name": "Svansa"
// }
// curl -X POST http://a18983579ab35409298ddbf805c122d5-969766123.eu-west-1.elb.amazonaws.com:80/function/authenticate-user -H "Content-Type: application/json" -d '{"username": "Svansa", "password": "Svansa"}'


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
