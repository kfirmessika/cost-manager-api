// src/tests/endpoints.test.js
require('dotenv').config();        // load DB_URI
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');     // note: path from tests folder
const User = require('../models/User');
const Cost = require('../models/Cost');

beforeAll(async () => {
    await mongoose.connect(process.env.DB_URI);
    // clear and seed
    await User.deleteMany({});
    await Cost.deleteMany({});
    await User.create({
        id: 123123,
        first_name: 'Test',
        last_name: 'User',
        birthday: new Date('1990-01-01'),
        marital_status: 'single'
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('API Endpoints', () => {
    it('GET /api/about should return authors', async () => {
        const res = await request(app).get('/api/about');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty('first_name');
        expect(res.body[0]).toHaveProperty('last_name');
    });

    it('POST /api/add should create cost and update user total', async () => {
        const res = await request(app)
            .post('/api/add')
            .send({
                userid: 123123,
                description: 'coffee',
                category: 'food',
                sum: 5
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
        // verify user total
        const user = await User.findOne({ id: 123123 });
        expect(user.total).toBe(5);
    });

    it('GET /api/report should return the cost report', async () => {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const res = await request(app)
            .get(`/api/report?id=123123&month=${month}&year=${year}`);
        expect(res.statusCode).toBe(200);
        // must find our 'food' category entry
        const entry = res.body.find(e => e._id === 'food');
        expect(entry).toBeDefined();
        expect(entry.costs[0]).toMatchObject({
            sum: 5,
            description: 'coffee'
        });
    });

    it('GET /api/users/:id should return the user profile', async () => {
        const res = await request(app).get('/api/users/123123');
        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({
            id: 123123,
            first_name: 'Test',
            last_name: 'User',
            total: 5
        });
    });
});
