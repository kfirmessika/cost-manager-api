const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
    id:           { type: Number, unique: true, required: true },
    first_name:  { type: String, required: true },
    last_name:   { type: String, required: true },
    birthday:    { type: Date,   required: true },
    marital_status: { type: String, enum: ['single','married','divorced','widowed'] },
    total:       { type: Number, default: 0 } // computed sum of costs
});

module.exports = model('User', userSchema);
