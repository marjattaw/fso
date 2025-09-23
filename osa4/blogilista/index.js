require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})
const Blog = mongoose.model('Blog', blogSchema)

const { PORT = 3003, MONGODB_URI } = process.env
mongoose.connect(MONGODB_URI).then(()=>console.log('MongoDB connected'))

app.get('/api/blogs', async (_req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})
app.post('/api/blogs', async (req, res) => {
  const saved = await new Blog(req.body).save()
  res.status(201).json(saved)
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
