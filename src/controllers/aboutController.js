// src/controllers/aboutController.js
exports.getAbout = (req, res) => {
    res.json([
        { first_name: 'kfir', last_name: 'messika' },
        { first_name: 'jonatan', last_name: 'wallenstein' }
    ]);
};
