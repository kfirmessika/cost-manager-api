const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const costSchema = new Schema({
    userid:      { type: Number, required: true, ref: 'User' },
    description: { type: String, required: true },
    category:    {
        type: String,
        enum: ['food','health','housing','sport','education'],
        required: true
    },
    sum:         { type: Number, required: true },
    date:        { type: Date,   default: Date.now }
});

module.exports = model('Cost', costSchema);
