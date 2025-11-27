require('dotenv').config()

const express = require('express')
const { sequelize, Blog, User } = require('./util/db')

const app = express()
app.use(express.json())

// Hae kaikki blogit + käyttäjätiedot
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
    console.error('Virhe Blog.findAllissa:', error)
    res.status(500).json({ error: 'something went wrong' })
  }
})

// Hae kaikki käyttäjät
app.get('/api/users', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: ['id', 'title', 'url']
    }
  })
  res.json(users)
})

// Luo uusi käyttäjä
app.post('/api/users', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.status(201).json(user)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Luo blogi käyttäjälle
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
    console.error('Virhe blogia luodessa:', error)
    res.status(400).json({ error: 'could not create blog' })
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
