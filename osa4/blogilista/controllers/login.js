const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')           // tai: const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({ username })
  const passwordCorrect = user ? await bcrypt.compare(password, user.passwordHash) : false

  if (!user || !passwordCorrect) {
    return res.status(401).json({ error: 'invalid username or password' })
  }

  const userForToken = { username: user.username, id: user._id }
  const token = jwt.sign(userForToken, process.env.SECRET /*, { expiresIn: 60*60 } */)

  res.status(200).json({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
