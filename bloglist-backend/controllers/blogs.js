const router = require('express').Router()
const jwt = require('jsonwebtoken')

const { Blog, User } = require('../models')
const { SECRET } = require('../util/config')

router.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.findAll()
    res.json(blogs)
  } catch (error) {
    next(error)
  }
})

const tokenExtractor  = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch (error) {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

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
    const blog = await Blog.findByPk(req.params.id)

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

router.delete('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (!blog) {
      return res.status(404).json({
        error: 'Blog not found'
      })
    }

    await blog.destroy()

    res.json({ message: 'Blog deleted successfully', blog })
  } catch (error) {
    next(error)
  }
})

module.exports = router