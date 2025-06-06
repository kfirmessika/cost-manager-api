// src/controllers/costController.js
// ─────────────────────────────────────────────────────────────────────────────
// Controller for cost‐related endpoints:
//   • POST /api/add    → addCost()
//   • (No GET/PUT/DELETE in this controller)

const Cost = require('../models/Cost');
const User = require('../models/User');

/**
 * @function addCost
 * @description POST /api/add → Create a new Cost and update the User’s total.
 *              Validates required fields and category. If the User does not exist,
 *              return a 404 error rather than creating a stub user.
 * @param {import('express').Request}  req   - JSON body: { userid, description, category, sum, [date] }.
 * @param {import('express').Response} res   - Returns 201 + newly created Cost object, or 400/404/500 + error.
 * @param {import('express').NextFunction} next - Pass errors to the global error handler.
 */
exports.addCost = async (req, res, next) => {
  try {
    const { userid, description, category, sum, date } = req.body;

    // 1) Validate presence of required fields:
    if (
        userid       === undefined ||
        !description ||
        !category    ||
        sum          === undefined
    ) {
      return res.status(400).json({
        error: 'Missing one of: userid, description, category, sum'
      });
    }

    // 2) Validate sum is a number:
    if (isNaN(Number(sum))) {
      return res.status(400).json({ error: '`sum` must be a number' });
    }

    // 3) Validate category is one of the five allowed:
    const ALLOWED_CATEGORIES = ['food', 'health', 'housing', 'sport', 'education'];
    if (!ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({
        error: '`category` must be one of: ' + ALLOWED_CATEGORIES.join(', ')
      });
    }

    // 4) Find the User; if not found, return 404:
    const user = await User.findOne({ id: Number(userid) });
    if (!user) {
      return res.status(404).json({ error: `User with id ${userid} not found` });
    }

    // 5) Create the Cost document:
    const cost = await Cost.create({
      userid:      Number(userid),
      description,
      category,
      sum:         Number(sum),
      // If `date` provided, use it; else default Date.now applies:
      date:        date ? new Date(date) : undefined
    });

    // 6) Increment the User’s total and save:
    user.total += Number(sum);
    await user.save();

    // 7) Return 201 + the newly created Cost object:
    return res.status(201).json(cost);
  } catch (err) {
    next(err);
  }
};
