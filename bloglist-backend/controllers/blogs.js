const router = require('express').Router()

const { Blog } = require('../models')

router.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.findAll()
    res.json(blogs)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { author, url, title } = req.body

    const blog = await Blog.create({
      author,
      url,
      title
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