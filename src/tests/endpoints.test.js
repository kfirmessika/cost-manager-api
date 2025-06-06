// src/tests/endpoints.test.js
// ─────────────────────────────────────────────────────────────────────────────
// Comprehensive integration tests for all /api endpoints using Jest + Supertest.

require('dotenv').config();            // load DB_URI
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');         // Express app

const User = require('../models/User');
const Cost = require('../models/Cost');

beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.DB_URI);

    // Clear collections
    await User.deleteMany({});
    await Cost.deleteMany({});

    // Seed one base user for multiple tests
    await User.create({
        id:             123123,
        first_name:    'Test',
        last_name:     'User',
        birthday:      new Date('1990-01-01'),
        marital_status: 'single',
        total:          0
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('API Endpoints Integration', () => {
    //
    // ─── GET /api/about ─────────────────────────────────────────────────────────
    //
    it('GET /api/about → 200 + array of two entries with first_name + last_name', async () => {
        const res = await request(app).get('/api/about');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(2);

        res.body.forEach((entry) => {
            expect(entry).toHaveProperty('first_name');
            expect(entry).toHaveProperty('last_name');
            expect(typeof entry.first_name).toBe('string');
            expect(typeof entry.last_name).toBe('string');
        });
    });

    //
    // ─── GET /api/users ─────────────────────────────────────────────────────────
    //
    it('GET /api/users → 200 + array containing the seeded user', async () => {
        const res = await request(app).get('/api/users');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);

        const u = res.body[0];
        expect(u).toMatchObject({
            id:         123123,
            first_name: 'Test',
            last_name:  'User',
            total:      0
        });
        expect(u).not.toHaveProperty('birthday');
        expect(u).not.toHaveProperty('marital_status');
        expect(u).not.toHaveProperty('_id');
    });

    //
    // ─── GET /api/users/:id ─────────────────────────────────────────────────────
    //
    it('GET /api/users/123123 → 200 + user object', async () => {
        // update total for verification
        await User.findOneAndUpdate({ id: 123123 }, { total: 10 });

        const res = await request(app).get('/api/users/123123');
        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({
            id:         123123,
            first_name: 'Test',
            last_name:  'User',
            total:      10
        });
        expect(res.body).not.toHaveProperty('birthday');
        expect(res.body).not.toHaveProperty('marital_status');
        expect(res.body).not.toHaveProperty('_id');
    });

    it('GET /api/users/999999 → 404 + { error: "User not found" }', async () => {
        const res = await request(app).get('/api/users/999999');
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error', 'User not found');
    });

    //
    // ─── POST /api/users ────────────────────────────────────────────────────────
    //
    it('POST /api/users → 201 + new user when all fields provided', async () => {
        const payload = {
            id:             555555,
            first_name:    'New',
            last_name:     'Person',
            birthday:      '2000-12-31',
            marital_status:'married'
        };
        const res = await request(app).post('/api/users').send(payload);
        expect(res.statusCode).toBe(201);
        expect(res.body).toMatchObject({
            id:         payload.id,
            first_name: payload.first_name,
            last_name:  payload.last_name,
            total:      0
        });

        // Verify in DB
        const fromDb = await User.findOne({ id: payload.id }).lean();
        expect(fromDb).toBeTruthy();
        expect(fromDb.first_name).toBe(payload.first_name);
        expect(fromDb.last_name).toBe(payload.last_name);
        expect(fromDb.birthday.toISOString().startsWith('2000-12-31')).toBe(true);
        expect(fromDb.marital_status).toBe('married');
        expect(fromDb.total).toBe(0);
    });

    it('POST /api/users → 400 if missing required field', async () => {
        const incomplete = {
            id:          777777,
            first_name: 'MissingLast'
            // missing last_name, birthday, marital_status
        };
        const res = await request(app).post('/api/users').send(incomplete);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty(
            'error',
            'Missing one of: id, first_name, last_name, birthday, marital_status'
        );
    });

    it('POST /api/users → 409 if ID already exists', async () => {
        const duplicate = {
            id:             123123,
            first_name:    'X',
            last_name:     'Y',
            birthday:      '1980-01-01',
            marital_status:'single'
        };
        const res = await request(app).post('/api/users').send(duplicate);
        expect(res.statusCode).toBe(409);
        expect(res.body).toHaveProperty('error', 'User with id 123123 already exists');
    });

    //
    // ─── POST /api/add ───────────────────────────────────────────────────────────
    //
    it('POST /api/add → 201 + create cost & update user total', async () => {
        // ensure category is valid
        const res = await request(app).post('/api/add').send({
            userid:      123123,
            description: 'coffee',
            category:    'food',
            sum:         5
        });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toMatchObject({
            userid:      123123,
            description: 'coffee',
            category:    'food',
            sum:         5
        });

        // Check user total increment (previous total 10 → now 15)
        const updated = await User.findOne({ id: 123123 });
        expect(updated.total).toBe(15);
    });

    it('POST /api/add → 400 if missing required field', async () => {
        const res = await request(app).post('/api/add').send({
            userid:      123123,
            description: 'no sum',
            category:    'food'
            // sum missing
        });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'Missing one of: userid, description, category, sum');
    });

    it('POST /api/add → 400 if sum is not numeric', async () => {
        const res = await request(app).post('/api/add').send({
            userid:      123123,
            description: 'bad sum',
            category:    'food',
            sum:         'abc'
        });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', '`sum` must be a number');
    });

    it('POST /api/add → 400 if category invalid', async () => {
        const res = await request(app).post('/api/add').send({
            userid:      123123,
            description: 'bad cat',
            category:    'invalid',
            sum:         10
        });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty(
            'error',
            '`category` must be one of: food, health, housing, sport, education'
        );
    });

    it('POST /api/add → 201 + create stub user if none exists', async () => {
        await User.deleteOne({ id: 999999 });
        await Cost.deleteMany({ userid: 999999 });

        const res = await request(app).post('/api/add').send({
            userid:      999999,
            description: 'snack',
            category:    'food',
            sum:         7
        });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toMatchObject({
            userid:      999999,
            description: 'snack',
            category:    'food',
            sum:         7
        });

        const stub = await User.findOne({ id: 999999 }).lean();
        expect(stub).toBeTruthy();
        expect(stub.first_name).toBe('Unknown');
        expect(stub.last_name).toBe('Unknown');
        expect(stub.birthday.toISOString().startsWith('1970-01-01')).toBe(true);
        expect(stub.marital_status).toBe('single');
        expect(stub.total).toBe(7);
    });

    //
    // ─── GET /api/report ─────────────────────────────────────────────────────────
    //
    describe('GET /api/report behavior', () => {
        beforeEach(async () => {
            // Clear existing costs for user 123123
            await Cost.deleteMany({ userid: 123123 });

            const now = new Date();
            // Add one food cost
            await Cost.create({
                userid:      123123,
                description: 'cupcake',
                category:    'food',
                sum:         4,
                date:        new Date(now.getTime())
            });
            // Add one sport cost
            await Cost.create({
                userid:      123123,
                description: 'gym',
                category:    'sport',
                sum:         20,
                date:        new Date(now.getTime())
            });
        });

        it('GET /api/report → 400 if query params missing', async () => {
            const res1 = await request(app).get('/api/report?id=123123');
            expect(res1.statusCode).toBe(400);
            expect(res1.body).toHaveProperty('error', 'Missing query parameters');

            const now = new Date();
            const month = now.getMonth() + 1;
            const year = now.getFullYear();
            const res2 = await request(app).get(`/api/report?month=${month}&year=${year}`);
            expect(res2.statusCode).toBe(400);
            expect(res2.body).toHaveProperty('error', 'Missing query parameters');
        });

        it('GET /api/report → 200 + five categories with correct costs', async () => {
            const now = new Date();
            const month = now.getMonth() + 1;
            const year = now.getFullYear();

            const res = await request(app).get(`/api/report?id=123123&month=${month}&year=${year}`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);

            // Check exactly five categories
            const cats = res.body.map((e) => e._id).sort();
            expect(cats).toEqual(['education', 'food', 'health', 'housing', 'sport']);

            // food group
            const food = res.body.find((e) => e._id === 'food');
            expect(Array.isArray(food.costs)).toBe(true);
            expect(food.costs.length).toBe(1);
            expect(food.costs[0]).toMatchObject({
                sum:         4,
                description: 'cupcake'
            });

            // sport group
            const sport = res.body.find((e) => e._id === 'sport');
            expect(Array.isArray(sport.costs)).toBe(true);
            expect(sport.costs.length).toBe(1);
            expect(sport.costs[0]).toMatchObject({
                sum:         20,
                description: 'gym'
            });

            // other categories must have empty costs array
            ['education', 'health', 'housing'].forEach((cat) => {
                const grp = res.body.find((e) => e._id === cat);
                expect(grp).toBeDefined();
                expect(Array.isArray(grp.costs)).toBe(true);
                expect(grp.costs).toEqual([]);
            });
        });
    });
});
