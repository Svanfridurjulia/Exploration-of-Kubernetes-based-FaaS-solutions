def handle(event, context):

    #Set the CORS headers
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': 'application/json'
    }

    #handle OPTIONS request
    if event.method == 'OPTIONS':
        return {
            "statusCode": 204,
            "body": "p",
            "headers": headers
        }
    
    return {
        "statusCode": 200,
        "body": "Takk fyrir okkur!",
        "headers": headers
    }
