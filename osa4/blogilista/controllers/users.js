const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

// listaa kaikki käyttäjät
usersRouter.get('/', async (_req, res, next) => {
  try {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
    res.json(users)
  } catch (err) { next(err) }
})

// luo uusi käyttäjä
usersRouter.post('/', async (req, res, next) => {
  try {
    const { username, name, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'username and password required' })
    }
    if (username.length < 3 || password.length < 3) {
      return res.status(400).json({ error: 'username and password must be at least 3 chars' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = new User({ username, name, passwordHash })
    const saved = await user.save()
    res.status(201).json(saved)
  } catch (err) { next(err) }
})

module.exports = usersRouter
