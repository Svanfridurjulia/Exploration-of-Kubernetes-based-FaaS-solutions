import json
import requests
import logging
import sys

def handle(event, context):
    """
    Returns the Spanish translation for a given english text.

    Parameter event: the HTTP request event
    Parameter context: the HTTP request context
    """

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



    params = {'q': event.body, 'langpair': 'en|es'}
    # Make GET request to the MyMemory API with the text to be translated and language pair
    response = requests.get('https://api.mymemory.translated.net/', params=params)
    # Parse the JSON response
    data = json.loads(response.text)
    # Extract the parsed translated text
    translatedText = data['responseData']['translatedText']
    
    return {
        "statusCode": 200,
        "body": translatedText, 
        "headers": headers
    }

   