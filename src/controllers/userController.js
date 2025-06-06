// src/controllers/userController.js
// ─────────────────────────────────────────────────────────────────────────────
// Controller for all “/api/users” endpoints:
//   • GET /api/users        → getAllUsers()
//   • GET /api/users/:id    → getUser()
//   • POST /api/users       → createUser()

const User = require('../models/User');

/**
 * @function getUser
 * @description GET /api/users/:id → Return a single user (id, first_name, last_name, total).
 * @param {import('express').Request}  req   - Expect req.params.id = user ID.
 * @param {import('express').Response} res   - Returns 200 + user JSON or 404 + error.
 * @param {import('express').NextFunction} next - Pass errors to the global error handler.
 */
exports.getUser = async (req, res, next) => {
  try {
    const user = await User
        .findOne({ id: Number(req.params.id) })
        // Only return the fields required by spec: id, first_name, last_name, total
        .select('id first_name last_name total -_id');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * @function getAllUsers
 * @description GET /api/users → Return an array of all users (id, first_name, last_name, total).
 * @param {import('express').Request}  req   - Express request (unused).
 * @param {import('express').Response} res   - Returns 200 + array of users JSON.
 * @param {import('express').NextFunction} next - Pass errors to the global error handler.
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User
        .find()
        .select('id first_name last_name total -_id')
        .lean();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

/**
 * @function createUser
 * @description POST /api/users → Create a new user with exactly {id, first_name, last_name, birthday, marital_status}.
 *                Returns 201 + {id, first_name, last_name, total}.
 *                Returns 400 if missing fields, 409 if id already exists.
 * @param {import('express').Request}  req   - Expect JSON body with id, first_name, last_name, birthday, marital_status.
 * @param {import('express').Response} res   - Returns status 201 or 400/409 + {error: ...}.
 * @param {import('express').NextFunction} next - Pass errors to the global error handler.
 */
exports.createUser = async (req, res, next) => {
  try {
    const { id, first_name, last_name, birthday, marital_status } = req.body;

    // 1) Validate presence of all required fields:
    if (
        id           === undefined ||
        !first_name  ||
        !last_name   ||
        !birthday    ||
        !marital_status
    ) {
      return res.status(400).json({
        error: 'Missing one of: id, first_name, last_name, birthday, marital_status'
      });
    }

    // 2) Check for duplicate ID:
    const existing = await User.findOne({ id: Number(id) });
    if (existing) {
      return res
          .status(409)
          .json({ error: `User with id ${id} already exists` });
    }

    // 3) Create & save the new User:
    const newUser = await User.create({
      id:            Number(id),
      first_name,
      last_name,
      birthday:      new Date(birthday),
      marital_status,
      total:         0
    });

    // 4) Return only the four fields required (id, first_name, last_name, total):
    return res.status(201).json({
      id:          newUser.id,
      first_name:  newUser.first_name,
      last_name:   newUser.last_name,
      total:       newUser.total
    });
  } catch (err) {
    next(err);
  }
};
