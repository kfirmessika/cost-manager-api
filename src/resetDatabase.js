// resetDatabase.js
// ─────────────────────────────────────────────────────────────────────────────
// Usage: node resetDatabase.js
//
// This script will reset the MongoDB database so that:
// • users collection is empty except for a single user:
//     { id: 123123, first_name: 'mosh', last_name: 'israeli', birthday: <some date>, marital_status: <some status>, total: 0 }
// • costs collection is completely empty.
//
// Make sure you have a valid .env file (or environment variable) DB_URI pointing to your MongoDB Atlas URI.

require('dotenv').config();
const mongoose = require('mongoose');

// 1) Import your models (adjust these paths if your folder structure differs):
const User = require('./models/User');
const Cost = require('./models/Cost');

async function resetDB() {
    if (!process.env.DB_URI) {
        console.error('✖️  ERROR: DB_URI is not defined in .env or environment variables.');
        process.exit(1);
    }

    try {
        // 2) Connect to MongoDB:
        await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser:    true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB.');

        // 3) Clear out the costs collection:
        await Cost.deleteMany({});
        console.log('🗑️  Emptied the "costs" collection.');

        // 4) Clear out the users collection:
        await User.deleteMany({});
        console.log('🗑️  Emptied the "users" collection.');

        // 5) Insert the single “imaginary user”:
        const imaginaryUser = {
            id:             123123,
            first_name:    'mosh',
            last_name:     'israeli',
            // You can pick any birthday (required by schema). Below is an example:
            birthday:      new Date('1990-01-01'),
            // Pick any valid marital_status from ['single','married','divorced','widowed']:
            marital_status:'single',
            total:          0
        };

        await User.create(imaginaryUser);
        console.log('✨ Inserted the single imaginary user into "users".');
        console.log('   →', JSON.stringify({
            id: imaginaryUser.id,
            first_name: imaginaryUser.first_name,
            last_name: imaginaryUser.last_name,
            total: imaginaryUser.total
        }, null, 2));

        console.log('\n🎉 Database has been reset to the required submission state.');
    } catch (err) {
        console.error('✖️  ERROR during reset:', err);
    } finally {
        // 6) Close the connection:
        await mongoose.connection.close();
        console.log('🔌 Disconnected from MongoDB. Exiting script.');
        process.exit(0);
    }
}

// Run the reset
resetDB();
