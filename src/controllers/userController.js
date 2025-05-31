// src/controllers/userController.js
const User = require('../models/User');

// Existing methods:
exports.getUser = async (req, res, next) => {
  try {
    const user = await User
      .findOne({ id: Number(req.params.id) })
      .select('id first_name last_name total -_id');

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

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

// ───────────── NEW: Create a brand-new user ─────────────
exports.createUser = async (req, res, next) => {
  try {
    const { id, first_name, last_name, birthday, marital_status } = req.body;

    // 1) Validate required fields
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

    // 2) Check whether a user with this `id` already exists
    const existing = await User.findOne({ id: Number(id) });
    if (existing) {
      return res
        .status(409)
        .json({ error: `User with id ${id} already exists` });
    }

    // 3) Create & save a new user document
    const newUser = await User.create({
      id:            Number(id),
      first_name,
      last_name,
      birthday:      new Date(birthday),
      marital_status,
      total:         0   // start at zero
    });

    // 4) Return only the four fields we care about
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
