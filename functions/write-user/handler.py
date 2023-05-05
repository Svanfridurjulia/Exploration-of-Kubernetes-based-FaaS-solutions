import os
import boto3
import json
import hashlib


def handle(req):
    """ 
    Returns a json message containing the reponse from putting the given user data to the database

    Parameter req: json message containing username, name and password for user to be added to the users database
    """

    reqData = json.loads(req)

    # Create the DynamoDB resource
    dynamodb = boto3.resource('dynamodb', region_name='eu-west-1')

    # Get the DynamoDB table
    table = dynamodb.Table('users')

    # Perform a scan operation to retrieve all items
    response = table.scan()

    # Find the maximum ID value
    if len(response['Items']) == 0:
        maxId = 0
    else:
        maxId = max(item['user_id'] for item in response['Items'])

    # Increment the ID by 1
    newId = maxId + 1


    # Extract username, fullname, and password from the request data
    username = reqData["username"]
    fullName = reqData["name"]
    password = reqData["password"]

    # Hash the password using SHA-256
    hashedPassword = hashlib.sha256(password.encode("utf-8")).hexdigest()

    # Connect to the "users" table
    usersTable = dynamodb.Table("users")

    # Put the user data into the "users" table
    response = usersTable.put_item(
        Item={
            "user_id" : newId,
            "user_name": username,
            "full_name": fullName,
            "password": hashedPassword,
        }
    )

    return json.dumps({"message": "User added successfully", "response": response})
