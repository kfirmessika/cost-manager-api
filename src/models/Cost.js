// src/models/Cost.js
// ─────────────────────────────────────────────────────────────────────────────
// Defines the Mongoose schema & model for “Cost” documents.
// Each Cost must belong to a User (via userid), have a description, category, sum, and date.

const mongoose = require('mongoose');
const { Schema, model } = mongoose;

/**
 * @typedef {Object} Cost
 * @property {number} userid       - Numeric ID of the User (required, foreign‐key)
 * @property {string} description  - Text description of the cost (required)
 * @property {string} category     - One of the five categories allowed (required)
 * @property {number} sum          - Numeric amount of this cost (required)
 * @property {Date}   date         - When this cost was incurred (defaults to now)
 */
const costSchema = new Schema({
    userid: {
        type: Number,
        required: true,
        ref: 'User'
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['food', 'health', 'housing', 'sport', 'education'],
        required: true
    },
    sum: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('Cost', costSchema);
