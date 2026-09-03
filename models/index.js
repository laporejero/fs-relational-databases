const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readingList')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: ReadingList, as: 'added_blogs' })
Blog.belongsToMany(User, { through: ReadingList, as: 'users_added' })

module.exports = { Blog, User, ReadingList }