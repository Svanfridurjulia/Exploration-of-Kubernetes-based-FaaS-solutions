import cors from 'cors';

// const cors = require('cors');

export default cors({
  origin: '*',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
});

