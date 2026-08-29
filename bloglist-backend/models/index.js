const Blog = require('./blog')
const User = require('./user')

Blog.sync({ alter: true }).then(() => {
  console.log('Blog table synchronized')
})
User.sync({ alter: true }).then(() => {
  console.log('User table synchronized')
})

module.exports = { Blog, User }