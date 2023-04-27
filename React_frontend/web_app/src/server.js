const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

console.log("here in server.js");

// Replace '*' with your specific allowed origin
const corsOptions = {
  origin: 'http://wep-app.fabulousasaservice.com',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
