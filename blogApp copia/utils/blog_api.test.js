const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../index');
const Blog = require('../models/blog');
const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const User = require('../models/user');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
let token;
let user;
 
beforeEach(async () => {
    await User.deleteMany({ username: 'testuser' });
    const passwordHash = await bcrypt.hash('password123', 10);
    user =  new User({ username: 'testuser', passwordHash });
    await user.save(); 
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
});

describe("GET /api/blogs", () => {
    
    test("should return all blog post", async () => {
        return request(app)
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    });
    test("unique identifier property of the blog posts is named id", async () => {
        await Blog.deleteMany({});  
        const initialBlogs = [
            { title: 'First Blog', author: 'Author 1', url: 'http://example.com/1', likes: 1 },
            { title: 'Second Blog', author: 'Author 2', url: 'http://example.com/2', likes: 2 }
        ];
        await Blog.insertMany(initialBlogs);

        const response = await request(app)
            .get('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);
        const blogs = response.body;
        blogs.forEach(blog => {
            assert.ok(blog.id);
            assert.strictEqual(blog._id, undefined);
            
        });
    });
    test('blog listing includes user information', async () => {
        await Blog.deleteMany({});
        const user = await User.findOne({username: 'testuser'});
        const initialBlogs = [
            { title: 'First Blog', author: 'Author 1', url: 'http://example.com/1', likes: 1 ,  user: user._id},
            { title: 'Second Blog', author: 'Author 2', url: 'http://example.com/2', likes: 2, user: user._id }
        ];
        await Blog.insertMany(initialBlogs);

        const response = await request(app)
            .get('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);
        const blogs = response.body;
        blogs.forEach(blog => {
            assert.ok(blog.user);
        });
    });
});

describe("POST /api/blogs", () => { 
    test('successfully creates a new blog post', async () => {
        const response = await request(app)
            .get('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);
        const initialBlogs = response.body;
        const user = await User.findOne({username: 'testuser'});



        const newBlog = {
            title: 'Test Blog',
            author: 'Test Author',
            url: 'http://testurl.com',
            likes: 5,
            user: user._id
        };
        await request(app)
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const reponse = await request(app)
            .get('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);
        const blogs = reponse.body;

        assert.strictEqual(blogs.length, initialBlogs.length + 1);

        const createdBlog = blogs.find(blog => blog.title === newBlog.title);
        assert.ok(createdBlog);
        assert.strictEqual(createdBlog.author, newBlog.author);   
        assert.strictEqual(createdBlog.url, newBlog.url);
        assert.strictEqual(createdBlog.likes, newBlog.likes);

        await Blog.deleteOne({ _id: createdBlog.id });
        console.log('Test Blog deleted from DB');
    });
});

describe("DELETE /api/blogs/:id", () => {   
    test('successfully deletes a blog post', async () => {
        const newBlog = {
            title: 'Test Blog',
            author: 'Test Author',
            url: 'http://testurl.com',
            likes: 5
        };
        const response = await request(app)
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const createdBlog = response.body;
        console.log(createdBlog.id)
        await request(app)
            .delete(`/api/blogs/${createdBlog.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204);

    });
});

describe('PATCH /api/blogs/:id', () => {
    test('successfully updates a blog post', async () => {
        const newBlog = {
            title: 'Test Blog',
            author: 'Test Author',
            url: 'http://testurl.com',
            likes: 5
        };
        const response = await request(app)
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const reponse = await request(app)
            .patch(`/api/blogs/${response.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ likes: 10 })
            .expect(200)
            .expect('Content-Type', /application\/json/);
        
        const createdBlog = response.body;
        await request(app)
            .delete(`/api/blogs/${createdBlog.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204);
    });
});

after(async () => {
    await mongoose.connection.close()
    console.log('DB connection closed')
  })