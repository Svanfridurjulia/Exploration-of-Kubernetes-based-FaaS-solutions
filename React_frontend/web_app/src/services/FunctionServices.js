


// const FUNCTIONS_URL = 'http://localhost:3005/function/';
const FUNCTIONS_URL = 'http://functions.fabulousasaservice.com:8080/function/';

// const FUNCTIONS_URL = 'http://a18983579ab35409298ddbf805c122d5-969766123.eu-west-1.elb.amazonaws.com:8080/function/';

export async function authenticationNodeFunction(data){

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



export async function passwordGoFunction() {

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

export async function translationPythonFunction(data) {
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

export async function writeUserPythonFunction(data) {
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

// curl -X POST http://a3c846d513571471da8da03057441b5b-920512917.eu-west-1.elb.amazonaws.com:8080/function/write-user \
//   -H 'Content-Type: application/json' \
//   -d '{
//         name: "testing",
//         username: "testing",
//         password: "testing"
//     }'


export function sendEmailGoFunction(username) {
  try {
    const resp = fetch(FUNCTIONS_URL + 'send-email', {
      method: "post",
      headers: {
        'Content-type': 'text/plain'
      },
      body: username
    })
  }
  catch (error) {
    console.error(error);
  }
}

export async function demoPythonFunction(){

  try {
    const resp = await fetch(FUNCTIONS_URL + 'cowboy-function', {
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


// module.exports = {
//     authenticationNodeFunction,
//     passwordGoFunction,
//     translationPythonFunction,
//     writeUserPythonFunction,
//     sendEmailGoFunction
// }