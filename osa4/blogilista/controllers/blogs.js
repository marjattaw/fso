const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// GET kaikki (4.8)
blogsRouter.get('/', async (_req, res, next) => {
  try {
    const blogs = await Blog.find({})
    res.json(blogs)
  } catch (err) { next(err) }
})

// POST uusi (4.10)
blogsRouter.post('/', async (req, res, next) => {
  try {
    const blog = new Blog(req.body)
    const saved = await blog.save()
    res.status(201).json(saved)
  } catch (err) { next(err) }
})

// DELETE yksi (4.13)
blogsRouter.delete('/:id', async (req, res, next) => {
  try {
    await Blog.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } catch (err) { next(err) }
})

module.exports = blogsRouter
