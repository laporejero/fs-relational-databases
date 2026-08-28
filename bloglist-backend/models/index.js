const Blog = require('./blog')

Blog.sync().then(() => {
  console.log('Blog table synchronized')
})

module.exports = { Blog }