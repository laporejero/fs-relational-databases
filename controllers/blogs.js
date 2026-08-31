const router = require('express').Router()
const { Op } = require('sequelize')
const tokenExtractor = require('../middleware/tokenExtractor')

const { Blog, User } = require('../models')

router.get('/', async (req, res, next) => {
  try {
    const where = {}

    if (req.query.search) {
      where[Op.or] = [
        {
          title: {
            [Op.substring]: req.query.search
          }
        },
        {
          author: {
            [Op.substring]: req.query.search
          }
        }
      ]
    }

    const blogs = await Blog.findAll({
      attributes: { exclude: ['userId'] },
      include: {
        model: User,
        attributes: ['name']
      },
      where,
      order: [['likes', 'DESC']]
    })
    res.json(blogs)
  } catch (error) {
    next(error)
  }
})

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const { author, url, title } = req.body

    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({
      author,
      url,
      title,
      userId: user.id
    })

    return res.json(blog)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id, {
      attributes: { exclude: ['userId'] },
      include: {
        model: User,
        attributes: ['name']
      }
    })

    if (!blog) {
      return res.status(404).json({
        error: 'Blog not found'
      })
    }

    res.json(blog)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' })
    }

    blog.likes = req.body.likes

    await blog.save()

    return res.json(blog)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (!blog) {
      return res.status(404).json({
        error: 'Blog not found'
      })
    }

    if (blog.userId !== req.decodedToken.id) {
      return res.status(403).json({
        error: 'only the creator can delete the blog'
      })
    }

    await blog.destroy()

    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router