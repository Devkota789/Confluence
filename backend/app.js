const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const pagesRoute = require('./routes/pages');
const spacesRoute = require('./routes/spaces'); 

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/pages', pagesRoute);
app.use('/api/spaces', spacesRoute); 

app.get('/', (req, res) => {
  res.send('API Running...');
});

module.exports = app;


