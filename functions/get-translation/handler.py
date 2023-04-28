import json
import requests

def handle(req):

    params = {'q': req, 'langpair': 'en|es'}
    response = requests.get('https://api.mymemory.translated.net/', params=params)
    data = json.loads(response.text)
    translated_text = data['responseData']['translatedText']
    return translated_text
