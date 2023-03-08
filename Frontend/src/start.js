
const http = require('http');
const fs = require('fs');
const path = require('path');

// // This should already be declared in your API file
// var app = express();

// // ADD THIS
// var cors = require('cors');
// app.use(cors());

const port = 3000; // change this to whatever port number you want
const htmlFilePath = path.join(__dirname, 'index.html'); // change this to the path of your HTML file

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    // serve the HTML file
    fs.readFile(htmlFilePath, (err, data) => {
      if (err) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end('Error loading index.html');
      } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
      }
    });
  } else {
    // handle other requests (e.g. CSS, JS files)
    const filePath = path.join(__dirname, req.url);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end('File not found');
      } else {
        const ext = path.extname(filePath);
        const contentType = getContentType(ext);
        res.writeHead(200, {'Content-Type': contentType});
        res.end(data);
      }
    });
  }
});

function getContentType(ext) {
  switch (ext) {
    case '.html':
      return 'text/html';
    case '.css':
      return 'text/css';
    case '.js':
      return 'text/javascript';
    default:
      return 'text/plain';
  }
}

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
