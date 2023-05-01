import cors from 'cors';

// const cors = require('cors');

export default cors({
  origin: [
    'http://web-app.fabulousasaservice.com',
    'http://localhost:3000'
  ],
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
});

