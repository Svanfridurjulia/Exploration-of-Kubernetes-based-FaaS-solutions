import json
import requests

def handle(req):
    """
    Returns the Spanish translation for a given english text.

    Parameter req: the english text to be translated to Spanish
    """

    req_json = json.loads(req)
    print(req_json)
    method = req_json.get('method', '')
    print(method)
    # Set the CORS headers
    headers = {
        'Access-Control-Allow-Origin': 'http://web-app.fabulousasaservice.com',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': 'application/json'
    }

    if method == 'OPTIONS':
        return json.dumps((204, '', headers))

    params = {'q': req, 'langpair': 'en|es'}
    # Make GET request to the MyMemory API with the text to be translated and language pair
    response = requests.get('https://api.mymemory.translated.net/', params=params)
    # Parse the JSON response
    data = json.loads(response.text)
    # Extract the parsed translated text
    translatedText = data['responseData']['translatedText']
    

    print(req)
    
    # Return the translated text along with the CORS headers
    return json.dumps(200, translatedText, headers)
