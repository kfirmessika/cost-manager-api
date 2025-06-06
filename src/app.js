// app.js
// ─────────────────────────────────────────────────────────────────────────────
// Main Express application file. Mounts all route modules under /api.

const express = require('express');
require('dotenv').config();       // Load environment variables (e.g., DB_URI)
const mongoose = require('mongoose');

const aboutRoutes = require('./routes/about');
const userRoutes  = require('./routes/users');
const costRoutes  = require('./routes/costs');

const app = express();

// ─── MIDDLEWARE ────────────────────────────────────────────────────────────────
app.use(express.json());          // Parse JSON bodies on incoming requests

// ─── ROUTES ─────────────────────────────────────────────────────────────────────
app.use('/api', aboutRoutes);
app.use('/api', userRoutes);
app.use('/api', costRoutes);

// ─── GLOBAL ERROR HANDLER ───────────────────────────────────────────────────────
// This catches any errors passed via next(err) in controllers
    app.use((err, req, res, _next) => {
        console.error(err.stack);
        res.status(500).json({ error: 'An internal server error occurred.' });
    });

// ─── DATABASE & SERVER START ────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
mongoose
    .connect(process.env.DB_URI, {
        useNewUrlParser:    true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Connected to MongoDB.');
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
    });

module.exports = app; // Export for testing (supertest)
