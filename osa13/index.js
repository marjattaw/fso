require('dotenv').config()

const express = require('express')
const { sequelize, Blog, User, ReadingList } = require('./util/db')

const app = express()
app.use(express.json())

// Hae kaikki blogit + käyttäjä
app.get('/', async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      include: {
        model: User,
        attributes: ['id', 'username', 'name']
      }
    })
    res.json(blogs)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'something went wrong' })
  }
})

// Hae kaikki käyttäjät ja heidän blogit
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll({
      include: {
        model: Blog,
        attributes: ['id', 'title', 'url'],
        through: {
          attributes: ['read']
        }
      }
    })
    res.json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'something went wrong' })
  }
})

// Lisää käyttäjä
app.post('/api/users', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.status(201).json(user)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Lisää blogi käyttäjälle
app.post('/api/blogs', async (req, res) => {
  try {
    const body = req.body

    const user = await User.findByPk(body.userId)
    if (!user) {
      return res.status(404).json({ error: 'user not found' })
    }

    const blog = await Blog.create({
      ...body,
      userId: user.id
    })

    res.status(201).json(blog)
  } catch (error) {
    console.error(error)
    res.status(400).json({ error: 'could not create blog' })
  }
})

// Lisää blogi käyttäjän reading-listille
app.post('/api/readinglists', async (req, res) => {
  try {
    const body = req.body

    const user = await User.findByPk(body.userId)
    const blog = await Blog.findByPk(body.blogId)

    if (!user || !blog) {
      return res.status(404).json({ error: 'user or blog not found' })
    }

    const reading = await ReadingList.create({
      userId: body.userId,
      blogId: body.blogId
    })

    res.status(201).json(reading)
  } catch (error) {
    console.error(error)
    res.status(400).json({ error: 'could not add to reading list' })
  }
})

// Hae yhden käyttäjän reading list
app.get('/api/users/:id/readinglist', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: {
        model: Blog,
        through: {
          attributes: ['read']
        }
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'user not found' })
    }

    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'something went wrong' })
  }
})

const start = async () => {
  try {
    await sequelize.authenticate()
    console.log('Database connected')

    app.listen(3001, () => {
      console.log('Server running on port 3001')
    })
  } catch (error) {
    console.error('Database connection failed:', error)
  }
}

start()
