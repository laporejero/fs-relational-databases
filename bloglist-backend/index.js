require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')
const express = require('express')
const app = express()

app.use(express.json())

const sequelize = new Sequelize(process.env.DATABASE_URL, { dialect: 'postgres' })

class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

Blog.sync().then(() => {
  console.log('Blog table synchronized')
})

app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll()

  console.log(JSON.stringify(blogs, null, 2))
  res.json(blogs)
})

app.post('/api/blogs', async (req, res) => {
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

app.delete('/api/blogs/:id', async (req, res) => {
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})