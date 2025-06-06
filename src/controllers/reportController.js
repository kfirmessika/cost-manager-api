// src/controllers/reportController.js
// ─────────────────────────────────────────────────────────────────────────────
// Controller for reporting endpoints:
//   • GET /api/report → getReport()

const Cost = require('../models/Cost');

/**
 * @function getReport
 * @description GET /api/report?id=<userid>&month=<m>&year=<y>
 *              → Returns an array of exactly five category‐objects:
 *                [
 *                  { _id: 'food', costs: [ … ] },
 *                  { _id: 'health', costs: [ … ] },
 *                  { _id: 'housing', costs: [ … ] },
 *                  { _id: 'sport', costs: [ … ] },
 *                  { _id: 'education', costs: [ … ] }
 *                ]
 *              If there are no Cost documents in a category, that category’s costs = [].
 *              Returns 400 if any query parameter is missing.
 *
 * @param {import('express').Request}  req   - Expect req.query.id, req.query.month, req.query.year.
 * @param {import('express').Response} res   - Returns 200 + filled report JSON, or 400 + { error }.
 * @param {import('express').NextFunction} next - Pass errors to the global error handler.
 */
exports.getReport = async (req, res, next) => {
    try {
        const { id: userid, month, year } = req.query;

        // 1) Check for missing query parameters
        if (!userid || !month || !year) {
            return res.status(400).json({ error: 'Missing query parameters' });
        }

        const m = parseInt(month, 10);
        const y = parseInt(year, 10);

        // 2) Run an aggregation that groups costs by category within the target month/year
        const reportAggregation = await Cost.aggregate([
            {
                $match: {
                    userid: Number(userid),
                    date: {
                        // Start of the month:
                        $gte: new Date(y, m - 1, 1),
                        // Start of the next month:
                        $lt:  new Date(y, m, 1)
                    }
                }
            },
            {
                $group: {
                    _id: '$category',
                    costs: {
                        $push: {
                            sum:         '$sum',
                            day:         { $dayOfMonth: '$date' },
                            description: '$description'
                        }
                    }
                }
            }
        ]);

        // 3) Define exactly all five categories (must match Cost schema enum):
        const ALL_CATEGORIES = ['food', 'health', 'housing', 'sport', 'education'];

        // 4) Create a lookup map of category → array of costs:
        const reportMap = reportAggregation.reduce((map, entry) => {
            map[entry._id] = entry.costs;
            return map;
        }, {});

        // 5) Build the final “filled” report array:
        const filledReport = ALL_CATEGORIES.map((cat) => ({
            _id:   cat,
            costs: reportMap[cat] || []
        }));

        // 6) Return JSON:
        return res.json(filledReport);
    } catch (err) {
        next(err);
    }
};
