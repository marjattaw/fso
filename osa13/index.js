require('dotenv').config()            // 👈 ENSIMMÄISENÄ

const express = require('express')
const { sequelize } = require('./util/db')
const Blog = require('./models/blog')

const app = express()
app.use(express.json())

app.get('/', async (req, res) => {
  try {
    const blogs = await Blog.findAll()
    res.json(blogs)
  } catch (error) {
    console.error('Virhe Blog.findAllissa:', error)
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
