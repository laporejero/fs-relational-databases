const router = require('express').Router()

const { Blog } = require('../models')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()

  console.log(JSON.stringify(blogs, null, 2))
  res.json(blogs)
})

router.post('/', async (req, res) => {
  try {
    const { author, url, title } = req.body

    const blog = await Blog.create({
      author,
      url,
      title
    })

    return res.json(blog)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.get('/:id', async (req, res) => {
    const blog = await Blog.findByPk(req.params.id)
    res.json(blog)
})

router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (!blog) {
      return res.status(404).json({
        message: 'Blog not found'
      })
    }

    await blog.destroy()

    res.json({ message: 'Blog deleted successfully', blog })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router