const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readingList')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { 
    through: ReadingList, 
    as: 'readings',
    foreignKey: 'user_id',
    otherKey: 'blog_id'
})
Blog.belongsToMany(User, { 
    through: ReadingList, 
    as: 'readers',
    foreignKey: 'blog_id',
    otherKey: 'user_id'
})

module.exports = { Blog, User, ReadingList }