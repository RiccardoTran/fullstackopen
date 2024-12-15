// controllers/blogs.js
const express = require('express');
const Blog = require('../models/blog');
const blogsRouter = express.Router();
const User = require('../models/user');
const authMiddleware = require('../middleware/auth');
const jwt = require('jsonwebtoken');

const getTokenFrom = (req) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

blogsRouter.get('/api/blogs', authMiddleware, async (req, res) => {
  try {
    const blogs = await Blog.find({});
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

blogsRouter.post('/api/blogs', async (req, res) => {
  const { title, author, url, likes } = req.body;
  const decodedToken = jwt.verify(getTokenFrom(req), process.env.JWT_SECRET);
  if(!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' });
  }
  
  const user = await User.findById(decodedToken.id);
  const blog = new Blog(
    {
      title,
      author,
      url,
      likes,
      user: user._id
    }
  );

  try {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

blogsRouter.delete('/api/blogs/:id', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

blogsRouter.patch('/api/blogs/:id', async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate  
      (req.params.id, req.body, { new: true });
    res.json(updatedBlog);
    res.status(200).end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = blogsRouter;