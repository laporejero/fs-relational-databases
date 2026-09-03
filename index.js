const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

// middleware
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
const errorHandler = require('./middleware/errorHandler')
const unknownEndpoint = require('./middleware/unknownEndpoint')

const { Blog, User, ReadingList } = require('./models')

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)

app.post('/api/reset', async (req, res, next) => {
  try {
    await ReadingList.destroy({
      truncate: true,
      restartIdentity: true
    })

    await Blog.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true
    })

    await User.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true
    })

    res.status(204).end()
  } catch (error) {
    console.error(error)
    next(error)
  }
})

app.get('/', (req, res) => {
  res.status(200).end()
})

app.use(unknownEndpoint)
app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()