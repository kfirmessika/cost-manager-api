// src/routes/users.js
const express            = require('express');
const {
  getUser,
  getAllUsers,
  createUser        // ← import the new function
} = require('../controllers/userController');

const router = express.Router();

// ─── NEW: Create User ─────────────────────────────────────────────────
router.post('/users', createUser);

// Existing “get by ID” and “get all”:
router.get('/users/:id', getUser);
router.get('/users',     getAllUsers);

module.exports = router;
