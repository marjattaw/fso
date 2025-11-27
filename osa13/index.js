require('dotenv').config()  // 👈 tämä ensin!

const express = require('express')
const { sequelize } = require('./util/db')
const Blog = require('./models/blog')

const app = express()
app.use(express.json())

// Hae kaikki blogit
app.get('/', async (req, res) => {
  try {
    const blogs = await Blog.findAll()
    res.json(blogs)
  } catch (error) {
    console.error('Virhe Blog.findAllissa:', error)
    res.status(500).json({ error: 'something went wrong' })
  }
})

// Lisää uusi blogi
app.post('/api/blogs', async (req, res) => {
  try {
    const blog = await Blog.create(req.body)
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
