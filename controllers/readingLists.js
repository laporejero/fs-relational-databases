const router = require('express').Router()

const { ReadingList, Blog, User } = require('../models')

router.post('/', async (req, res, next) => {
    try {
        const { blogId, userId } = req.body

        if (!Number.isInteger(blogId)) {
            return res.status(400).json({
                error: 'Blog ID must be an integer'
            })
        }

        if (!Number.isInteger(userId)) {
            return res.status(400).json({
                error: 'User ID must be an integer'
            })
        }

        const blog = await Blog.findByPk(blogId)

        if (!blog) {
            return res.status(404).json({
                error: 'Blog not found'
            })
        }

        const user = await User.findByPk(userId)

        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            })
        }

        const reading = await ReadingList.create({
            blog_id: blogId,
            user_id: userId
        })

        return res.json(reading)
    } catch (error) {
        next(error)
    }
})

module.exports = router