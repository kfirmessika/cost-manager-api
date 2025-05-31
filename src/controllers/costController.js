// src/controllers/costController.js
const Cost = require('../models/Cost');
const User = require('../models/User');

exports.addCost = async (req, res, next) => {
  try {
    const { userid, description, category, sum, date } = req.body;

    // 1) First, look up the user by their numeric "id":
    let user = await User.findOne({ id: Number(userid) });

    // 2) If no user exists, create a “stub” User with default placeholders:
    if (!user) {
      user = await User.create({
        id: Number(userid),
        // You can choose default values or leave them blank/null if your schema allows:
        first_name:     'Unknown',
        last_name:      'Unknown',
        birthday:       new Date('1970-01-01'), 
        marital_status: 'single',
        total:          0
      });
    }

    // 3) Now create the cost document:
    const cost = await Cost.create({
      userid:      Number(userid),
      description,
      category,
      sum,
      // if `date` was provided, use it; otherwise default to now
      date: date ? new Date(date) : undefined
    });

    // 4) Increment the User’s total by this sum:
    user.total += Number(sum);
    await user.save();

    // 5) Return the newly created cost:
    return res.status(201).json(cost);
  } catch (err) {
    next(err);
  }
};
