import fetch from 'node-fetch';
import express from 'express';
import middleware from './middleware.js';
import bodyParser from 'body-parser';

// const express = require('express');
// const middleware = require('./middleware');
const app = express();

// const URL = 'http://a18983579ab35409298ddbf805c122d5-969766123.eu-west-1.elb.amazonaws.com:80/function/';
const URL = 'http://functions.fabulousasaservice.com:8080/function/'

app.use(middleware);
app.use(bodyParser.json());

app.all('/function/authenticate-user', (req, res) => {
    fetch(URL + 'authenticate-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
      })
        .then(response => {
            if (!response.ok) {
              console.log(response);
            throw new Error('Response not okay');
            }
            return response.text();
        })
        .then(text => {
            console.log(text);
            const data = JSON.parse(text);
            console.log(data);
            res.send(JSON.stringify(data));
        })
      .catch(error => {
        console.log(error);
      });
});

app.all('/function/make-passw', (req, res) => {
  // Call OpenFaaS function 2 and forward the request
  fetch(URL + 'make-passw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
            if (!response.ok) {
            throw new Error('Response not okay');
            }
            return response.text();
        })
        .then(text => {
            res.send(JSON.stringify(text));
        })
      .catch(error => {
        console.log(error);
      });
});

app.all('/function/get-translation', (req, res) => {
  fetch(URL + 'get-translation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    })
      .then(response => {
          if (!response.ok) {
            console.log(response);
          throw new Error('Response not okay');
          }
          return response.text();
      })
      .then(text => {
          res.send(JSON.stringify(text));
      })
    .catch(error => {
      console.log(error);
    });
});


app.all('/function/write-user', (req, res) => {
  fetch(URL + 'write-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    })
      .then(response => {
          if (!response.ok) {
            console.log(response);
          throw new Error('Response not okay');
          }
          return response.text();
      })
      .then(text => {
          res.send(JSON.stringify(text));
      })
    .catch(error => {
      console.log(error);
    });
});

app.all('/function/send-email', (req, res) => {
  console.log(req.body);
  fetch(URL + 'send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: req.body
    })
    .catch(error => {
      console.log(error);
    });
});

app.all('/function/python-function', (req, res) => {
  fetch(URL + 'python-function', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
          if (!response.ok) {
            console.log(response);
          throw new Error('Response not okay');
          }
          return response.text();
      })
      .then(text => {
          res.send(JSON.stringify(text));
      })
    .catch(error => {
      console.log(error);
    });
});


// ...

app.listen(3005, () => {
  console.log('Gateway server listening on port 3005!');

});