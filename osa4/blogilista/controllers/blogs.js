const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

const getTokenFrom = (req) => {
  const auth = req.get('authorization')
  return auth && auth.startsWith('Bearer ') ? auth.replace('Bearer ', '') : null
}

// GET kaikki – käyttäjät mukana
blogsRouter.get('/', async (_req, res, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    res.json(blogs)
  } catch (err) { next(err) }
})

// POST uusi – vaatii tokenin, asettaa userin
blogsRouter.post('/', async (req, res, next) => {
  try {
    const token = getTokenFrom(req)
    const decoded = jwt.verify(token, process.env.SECRET)
    if (!decoded.id) return res.status(401).json({ error: 'token invalid' })

    const user = await User.findById(decoded.id)
    if (!user) return res.status(400).json({ error: 'user missing' })

    const blog = new Blog({
      title: req.body.title,
      author: req.body.author,
      url: req.body.url,
      likes: req.body.likes ?? 0,
      user: user._id
    })

    const saved = await blog.save()
    user.blogs = user.blogs.concat(saved._id)
    await user.save()

    const populated = await saved.populate('user', { username: 1, name: 1 })
    res.status(201).json(populated)
  } catch (err) { next(err) }
})

// DELETE (tässä ei vielä tarkasteta omistajuutta – se on 4.21)
blogsRouter.delete('/:id', async (req, res, next) => {
  try {
    await Blog.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } catch (err) { next(err) }
})

module.exports = blogsRouter
