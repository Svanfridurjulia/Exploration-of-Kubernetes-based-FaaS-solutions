


const FUNCTIONS_URL = 'http://localhost:3005/function/';

// const FUNCTIONS_URL = 'http://a18983579ab35409298ddbf805c122d5-969766123.eu-west-1.elb.amazonaws.com:8080/function/';

async function authenticationNodeFunction(data){

  try {
    const resp = await fetch(FUNCTIONS_URL + 'authenticate-user', {
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



async function passwordGoFunction() {

  try {
    const resp = await fetch(FUNCTIONS_URL + 'make-passw', {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
        
            }});
    const returnData = await resp.json();
    return returnData;

  } catch (error) {
    console.error(error);
  }

}

async function translationPythonFunction(data) {
  try {
    const resp = await fetch(FUNCTIONS_URL + 'get-translation', {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
          });
    
    const returnData = await resp.json();
    console.log(returnData);
    return returnData;

  } catch (error) {
    console.error(error);
  }

}

async function writeUserPythonFunction(data) {
  try {
    const resp = await fetch(FUNCTIONS_URL + 'write-user', {
      method: "post",
      headers: {
        'Content-type' : 'application/json'
      },
      body: JSON.stringify(data)
    })
    const returnData = await resp.json();
    return returnData;
  }
  catch (error){
    console.error(error)
  }
}


module.exports = {
    authenticationNodeFunction,
    passwordGoFunction,
    translationPythonFunction,
    writeUserPythonFunction
}