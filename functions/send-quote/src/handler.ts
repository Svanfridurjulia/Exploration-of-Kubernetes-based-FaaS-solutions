import AWS from 'aws-sdk';
const dynamoDB = new AWS.DynamoDB.DocumentClient();

export async function handle(event: any, context: any, callback: (err: any, result: any) => void) {
  let err;
  try {
    // Extract values from event
    const { post_id, user_id, post_date, post_text } = event;
  
    // Construct the object to be written to DynamoDB
    const item = {
      post_id,
      user_id,
      post_date,
      post_text}
  
    // Define the parameters for the DynamoDB put operation
    const params = {
      TableName: 'posts',
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
  } catch (error: any) {
    // Return error response
    const result = {
      statusCode: 500,
      body: `Error writing to DynamoDB: ${error.message}`
    };
    callback(null, result);
  }
}
