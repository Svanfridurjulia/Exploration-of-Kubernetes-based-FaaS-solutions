"use strict"

module.exports = async (event, context) => {
    const jsonObj = JSON.parse(event);
    const username = jsonObj.username;
    const password = jsonObj.password;

    if (username.length > 4 && password.length > 5){
        context.res = {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            status: 200
            
        };
        const response = {
            statusCode: context.res.status,
            body: JSON.stringify({ message: "authenticated" }),
        };
        return response;
        
    }
    else {
        context.res = {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            status: 401
            
        };
        const response = {
            statusCode: context.res.status,
            body: JSON.stringify({ message: "not authenticated" }),
        };
        return response;
    }
}
