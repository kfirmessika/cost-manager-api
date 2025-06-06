// src/controllers/aboutController.js
// ─────────────────────────────────────────────────────────────────────────────
// Controller for the "About" endpoint. Returns a hard‐coded list of developers.

/**
 * @function getAbout
 * @description GET /api/about → Returns the team members (first_name + last_name).
 * @param {import('express').Request}  req   - Express request object (unused here).
 * @param {import('express').Response} res   - Express response object.
 */
exports.getAbout = (req, res) => {
    // Return exactly two entries (capitalized) according to the final project PDF spec:
    res.json([
        { first_name: 'Kfir',    last_name: 'Messika' },
        { first_name: 'Jonatan', last_name: 'Wallenstein' }
    ]);
};
