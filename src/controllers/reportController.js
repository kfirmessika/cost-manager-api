const Cost = require('../models/Cost');

exports.getReport = async (req, res, next) => {
    try {
        const { id: userid, month, year } = req.query;
        if (!userid || !month || !year) {
            return res.status(400).json({ error: 'Missing query parameters' });
        }
        const m = parseInt(month, 10);
        const y = parseInt(year, 10);

        const report = await Cost.aggregate([
            { $match: { userid: Number(userid),
                    date: {
                        $gte: new Date(y, m - 1, 1),
                        $lt:  new Date(y, m, 1)
                    }
                }},
            { $group: {
                    _id: '$category',
                    costs: {
                        $push: {
                            sum: '$sum',
                            day: { $dayOfMonth: '$date' },
                            description: '$description'
                        }
                    }
                }}
        ]);

        res.json(report);
    } catch (err) {
        next(err);
    }
};
