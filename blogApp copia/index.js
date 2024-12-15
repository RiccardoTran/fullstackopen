// index.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./utils/config');
const blogRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(blogRouter);
app.use('/api/users', usersRouter)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;