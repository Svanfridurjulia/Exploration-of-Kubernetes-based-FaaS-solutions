
const FUNCTIONS_URL = 'http://localhost:3005/function/';

async function NodeFunction(data){

  try {
    const resp = await fetch(FUNCTIONS_URL + 'nodetest', {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
        
            },
            body: JSON.stringify(data)});
    const returnData = await resp.json();
    return returnData;

  } catch (error) {
    console.error(error);
  }
}

module.exports = {
    NodeFunction
}