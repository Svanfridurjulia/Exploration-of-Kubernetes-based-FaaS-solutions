import os
import boto3
import json
import hashlib


def handle(req):

    req_data = json.loads(req)

    # Create the DynamoDB resource
    dynamodb = boto3.resource('dynamodb', region_name='eu-west-1')

    # Get the DynamoDB table
    table = dynamodb.Table('users')

    # Perform a scan operation to retrieve all items
    response = table.scan()

    # Find the maximum ID value
    if len(response['Items']) == 0:
        max_id = 0
    else:
        max_id = max(item['user_id'] for item in response['Items'])

    # Increment the ID by 1
    new_id = max_id + 1


    # Extract username, fullname, and password from the request data
    username = req_data["username"]
    fullname = req_data["name"]
    password = req_data["password"]

    # Hash the password using SHA-256
    hashed_password = hashlib.sha256(password.encode("utf-8")).hexdigest()

    # Connect to the "users" table
    users_table = dynamodb.Table("users")

    # Put the user data into the "users" table
    response = users_table.put_item(
        Item={
            "user_id" : new_id,
            "user_name": username,
            "full_name": fullname,
            "password": hashed_password,
        }
    )

    return json.dumps({"message": "User added successfully", "response": response})
