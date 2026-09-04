const router = require('express').Router()
const tokenExtractor = require('../middleware/tokenExtractor')

const { ReadingList, Blog, User } = require('../models')

router.post('/', tokenExtractor, async (req, res, next) => {
    try {
        const { blogId } = req.body
        const userId = req.decodedToken.id

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

router.put('/:id', tokenExtractor, async (req, res, next) => {
    try {
        const reading = await ReadingList.findOne({
            where: {
                id: req.params.id,
                user_id: req.decodedToken.id
            }
        })

        if (!reading) {
            return res.status(404).json({ error: 'reading list not found' })
        } 

        if (typeof req.body.read !== 'boolean') {
            return res.status(400).json({
                error: 'read must be a boolean'
            })
        }

        reading.read = req.body.read

        await reading.save()

        return res.json(reading)
    } catch (error) {
        next(error)
    }
})

module.exports = router