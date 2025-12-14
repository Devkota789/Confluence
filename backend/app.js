const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const spacesRoute = require('./routes/spaces');
const pagesRoute = require('./routes/pages');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/spaces', spacesRoute);
app.use('/api/pages', pagesRoute);

app.get('/', (req, res) => res.send('API Running...'));

module.exports = app;
