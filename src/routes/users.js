// src/routes/users.js
// ─────────────────────────────────────────────────────────────────────────────
// Defines routes for all “/api/users” endpoints:
//   • POST   /api/users     → createUser()
//   • GET    /api/users/:id → getUser()
//   • GET    /api/users     → getAllUsers()

const express = require('express');
const {
  getUser,
  getAllUsers,
  createUser
} = require('../controllers/userController');

const router = express.Router();

// POST /api/users → createUser()
router.post('/users', createUser);

// GET /api/users/:id → getUser()
router.get('/users/:id', getUser);

// GET /api/users → getAllUsers()
router.get('/users', getAllUsers);

module.exports = router;
