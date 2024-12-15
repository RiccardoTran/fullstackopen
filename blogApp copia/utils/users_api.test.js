const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../index');
const Blog = require('../models/blog');
const { test, describe, after } = require('node:test')
const assert = require('node:assert')

const request = require('supertest');
const User = require('../models/user');

describe("POST /api/users", () => { 
    test('successfully creates a new user', async () => {
        const usersAtStart = await User.find({});
        const newUser = {
            username: 'testuser1',
            name: 'Test User 1',
            password: 'password123'
          }
        
        await request(app)
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await User.find({});
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);
        const usernames = usersAtEnd.map(u => u.username);
        assert(usernames.includes(newUser.username));
        after(async () => {
            await User.deleteOne({ username: newUser.username });
            await mongoose.connection.close();
        })
    });

});

