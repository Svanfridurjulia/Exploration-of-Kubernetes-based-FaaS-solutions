import os
import boto3
import json
import hashlib


# # Get the AWS credentials from environment variables
# # with open("/var/openfaas/secrets/AWS_ACCESS_KEY_ID", "r") as f:
# #     aws_access_key_id = f.read().strip()

# # with open("/var/openfaas/secrets/AWS_SECRET_ACCESS_KEY", "r") as f:
# #     aws_secret_access_key = f.read().strip()

# aws_access_key_id = os.environ["openfaas_secret_aws-credentials_aws_access_key"]
# aws_secret_access_key = os.environ["openfaas_secret_aws-credentials_aws_secret_key"]


# # aws_access_key_id = os.environ["AWS_ACCESS_KEY_ID"]
# # aws_secret_access_key = os.environ["AWS_SECRET_ACCESS_KEY"]
# aws_default_region = 'eu-west-1'

# # Create a boto3 session with the provided credentials
# session = boto3.Session(
#     aws_access_key_id=aws_access_key_id,
#     aws_secret_access_key=aws_secret_access_key,
#     region_name=aws_default_region,
# )

# # Initialize a DynamoDB client using the session
# dynamodb = session.resource("dynamodb")


def handle(req):

    req_data = json.loads(req)

    # Create the DynamoDB resource
    dynamodb = boto3.resource('dynamodb', region_name='eu-west-1')

    # Get the DynamoDB table
    table = dynamodb.Table('users')

    # Perform a scan operation to retrieve all items
    response = table.scan()

    # Find the maximum ID value
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
