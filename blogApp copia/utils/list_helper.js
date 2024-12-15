//First, define a dummy function that receives an array of 
// blog posts as a parameter and always returns the value 1.
const User = require('../models/user')

const dummy = (blogs) => {
    return 1;
  }
   
const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
  }

const favoriteBlog = (blogs) => {
    return blogs.reduce((max, blog) => max.likes > blog.likes ? max : blog, blogs[0])
  }

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
  }

module.exports = {
dummy, totalLikes, favoriteBlog, usersInDb
}