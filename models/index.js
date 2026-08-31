const Blog = require('./blog')
const User = require('./user')

User.hasMany(Blog)
Blog.belongsTo(User)

const syncModels = async () => {
  await User.sync({ alter: true })
  console.log('User table synchronized')

  await Blog.sync({ alter: true })
  console.log('Blog table synchronized')
}

syncModels()

module.exports = { Blog, User }