// src/models/User.js
// ─────────────────────────────────────────────────────────────────────────────
// Defines the Mongoose schema & model for “User” documents.
// Each user has exactly: id, first_name, last_name, birthday, marital_status, total.
// “total” is computed as the sum of all associated Costs for that user.

const mongoose = require('mongoose');
const { Schema, model } = mongoose;

/**
 * @typedef {Object} User
 * @property {number} id             - Unique numeric user ID (required)
 * @property {string} first_name    - First name of the user (required)
 * @property {string} last_name     - Last name of the user (required)
 * @property {Date}   birthday      - Date of birth (required)
 * @property {string} marital_status- One of: 'single','married','divorced','widowed'
 * @property {number} total         - Running total of all this user's costs (default: 0)
 */
const userSchema = new Schema({
    id: {
        type: Number,
        unique: true,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    marital_status: {
        type: String,
        enum: ['single', 'married', 'divorced', 'widowed'],
        required: true
    },
    total: {
        type: Number,
        default: 0
    }
});

module.exports = model('User', userSchema);
