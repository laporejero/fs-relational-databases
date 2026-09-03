const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readingList')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { 
    through: ReadingList, 
    as: 'added_blogs',
    foreignKey: 'user_id',
    otherKey: 'blog_id'
})
Blog.belongsToMany(User, { 
    through: ReadingList, 
    as: 'users_added',
    foreignKey: 'blog_id',
    otherKey: 'user_id'
})

module.exports = { Blog, User, ReadingList }