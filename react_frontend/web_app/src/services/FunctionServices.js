


const FUNCTIONS_URL = 'http://functions.fabulousasaservice.com:8080/function/';


/**
 * Sends a user authentication request to the backend server.
 * @param {Object} data - The authentication data to be sent to the server.
 * @returns {Promise} A Promise that resolves with the response data from the server, or rejects with an error if there is one.
 */
export async function authenticationNodeFunction(data) {

    try {
        // Send a POST request to the "authenticate-user" endpoint on the server.
        // Include the authentication data in the request body.
        const resp = await fetch(FUNCTIONS_URL + 'authenticate-user', {
            method: "POST",
            headers: {
                'Content-type': 'application/json'

            },
            body: JSON.stringify(data)
        });

        // Extract the response data from the JSON in the response body.
        const returnData = await resp.json();
        return returnData;

    } catch (error) {
        // Log any errors that occur during the request.
        console.error(error);
    }
}

/**
 * Sends a request to generate a new password to the backend server.
 * @returns {Promise} A Promise that resolves with the generated password, or rejects with an error if there is one.
 */
export async function passwordGoFunction() {
    try {
        // Send a POST request to the "make-passw" endpoint on the server.
        const resp = await fetch(FUNCTIONS_URL + 'make-passw', {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            }
        });

        // Extract the generated password from the response body.
        const returnData = await resp.text();
        return returnData;

    } catch (error) {
        // Log any errors that occur during the request.
        console.error(error);
    }
}

/**
 * Sends a text translation request to the backend server.
 * @param {Object} data - The text to be translated.
 * @returns {Promise} A Promise that resolves with the translated text, or rejects with an error if there is one.
 */
export async function translationPythonFunction(data) {
    try {
        // Send a POST request to the "get-translation" endpoint on the server.
        // Include the given text in the request body.
        const resp = await fetch(FUNCTIONS_URL + 'get-translation', {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        // Extract the translated text from the JSON in the response body.
        const returnData = await resp.json();
        return returnData;

    } catch (error) {
        // Log any errors that occur during the request.
        console.error(error);
    }
}

/**
 * Sends a user information request to be stored in the backend server.
 * @param {Object} data The user information to be sent to the server.
 * @returns {Promise} A Promise that resolves with the response data from the server, or rejects with an error if there is one.
 */
export async function writeUserPythonFunction(data) {
    try {
        // Send a POST request to the "write-user" endpoint on the server.
        // Include the given user information in the request body.
        const resp = await fetch(FUNCTIONS_URL + 'write-user', {
            method: "post",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        // Extract the response data from the JSON in the response body.
        const returnData = await resp.json();
        return returnData;
    }
    catch (error) {
        // Log any errors that occur during the request.
        console.error(error)
    }
}



/**
 * Sends an email notification request to the backend server.
 * @param {String} username The username of registered user.
 */
export function sendEmailGoFunction(username) {
    try {
        // Send a POST request to the "send-email" endpoint on the server.
        // Include the given username in the request body.
        const resp = fetch(FUNCTIONS_URL + 'send-email', {
            method: "post",
            headers: {
                'Content-type': 'text/plain'
            },
            body: username
        })
    }
    catch (error) {
        // Log any errors that occur during the request.
        console.error(error);
    }
}

/**
 * Sends a request to demo function in the backend server.
 * @returns {Promise} A Promise that resolves with the response data from the server, or rejects with an error if there is one.
 */
export async function demoPythonFunction() {
    try {
        // Send a POST request to the demo endpoint on the server.
        const resp = await fetch(FUNCTIONS_URL + 'demo-function8', {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            }
        });
        // Extract the response data from the JSON in the response body.
        const returnData = await resp.text();
        return returnData;

    } catch (error) {
        // Log any errors that occur during the request.
        console.error(error);
    }
}

/**
 * Sends a request to demo function in the backend server.
 * @returns {Promise} A Promise that resolves with the response data from the server, or rejects with an error if there is one.
 */
export async function writePostNodeFunction(data) {
    try {
        // Send a POST request to the write-post endpoint on the server.
        const resp = await fetch(FUNCTIONS_URL + 'write-post', {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        // Extract the response data from the JSON in the response body.
        const returnData = await resp.json();
        return returnData;

    } catch (error) {
        // Log any errors that occur during the request.
        console.error(error);
    }
}