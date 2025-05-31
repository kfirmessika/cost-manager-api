// src/app.js
const express = require('express');
const app = express();

app.use(express.json());

app.use('/api', require('./routes/costs'));
app.use('/api', require('./routes/about'));
app.use('/api', require('./routes/users'));  // new

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: err.message });
});

module.exports = app;
