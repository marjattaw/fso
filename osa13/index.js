require('dotenv').config()

const express = require('express')
const { sequelize } = require('./util/db')
const Blog = require('./models/blog')
const User = require('./models/user')
const ReadingList = require('./models/reading_list')

const app = express()
app.use(express.json())

// Relaatiot
User.hasMany(Blog)
Blog.belongsTo(User)
User.belongsToMany(Blog, { through: ReadingList })
Blog.belongsToMany(User, { through: ReadingList })

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

// Hae kaikki käyttäjät ja heidän lukulistansa
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll({
      include: {
        model: Blog,
        attributes: ['id', 'title', 'url'],
        through: {
          attributes: ['id', 'read']
        }
      }
    })
    res.json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'something went wrong' })
  }
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
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes ?? 0,
      userId: user.id
    })

    res.status(201).json(blog)
  } catch (error) {
    console.error(error)
    res.status(400).json({ error: 'could not create blog' })
  }
})

// Lisää blogi käyttäjän reading-listalle
app.post('/api/readinglists', async (req, res) => {
  try {
    const { userId, blogId } = req.body

    const user = await User.findByPk(userId)
    const blog = await Blog.findByPk(blogId)

    if (!user || !blog) {
      return res.status(404).json({ error: 'user or blog not found' })
    }

    const reading = await ReadingList.create({
      userId,
      blogId,
      read: false
    })

    res.status(201).json(reading)
  } catch (error) {
    console.error(error)
    res.status(400).json({ error: 'could not add to reading list' })
  }
})

// Hae yhden käyttäjän lukulista (+ suodatus ?read=true/false)
app.get('/api/users/:id/readinglist', async (req, res) => {
  try {
    const readFilter = {}
    if (req.query.read === 'true') {
      readFilter.read = true
    } else if (req.query.read === 'false') {
      readFilter.read = false
    }

    const user = await User.findByPk(req.params.id, {
      include: {
        model: Blog,
        through: {
          attributes: ['id', 'read'],
          where: Object.keys(readFilter).length ? readFilter : undefined
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

// Päivitä readinglist-rivin read-arvo
app.put('/api/readinglists/:id', async (req, res) => {
  try {
    const { read } = req.body

    const item = await ReadingList.findByPk(req.params.id)
    if (!item) {
      return res.status(404).json({ error: 'reading list item not found' })
    }

    item.read = read
    await item.save()

    res.json(item)
  } catch (error) {
    console.error(error)
    res.status(400).json({ error: 'could not update reading list item' })
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
