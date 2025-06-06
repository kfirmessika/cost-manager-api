// src/server.js
const path = require('path');

// Tell dotenv exactly where your .env lives (one level up from src/)
require('dotenv').config({
    path: path.resolve(__dirname, '../.env')
});

// Immediately verify it actually loaded:
console.log('> DEBUG – DB_URI =', process.env.DB_URI);

const mongoose = require('mongoose');

// Connect to MongoDB
// still in src/server.js, below the dotenv lines…

mongoose
    .connect(process.env.DB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err =>
        console.error('❌ MongoDB connection error:', err)
    );


// Start Express
const app = require('./app');
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
    console.log(`🚀 Server listening on http://localhost:${PORT}`)
);
