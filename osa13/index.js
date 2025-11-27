require('dotenv').config()

const express = require('express')
const jwt = require('jsonwebtoken')
const { Op, fn, col } = require('sequelize')

const { sequelize } = require('./util/db')
const Blog = require('./models/blog')
const User = require('./models/user')
const ReadingList = require('./models/reading_list')
const Session = require('./models/session')

const app = express()
app.use(express.json())

// Relaatiot
User.hasMany(Blog)
Blog.belongsTo(User)
// lukulista alias "readings"
User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingList })

/**
 * TOKEN-MIDDLEWARE (13.10 + 13.24)
 * - tarkistaa JWT:n
 * - tarkistaa onko token sessions-taulussa
 * - tarkistaa ettei käyttäjä ole disabled
 */

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')

  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    req.decodedToken = null
    req.token = null
    return next()
  }

  const token = authorization.substring(7)

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)

    // onko token sessiotaulussa?
    const session = await Session.findOne({ where: { token } })
    if (!session) {
      return res.status(401).json({ error: 'session expired' })
    }

    // onko käyttäjä olemassa ja ei-disabled?
    const user = await User.findByPk(decodedToken.id)
    if (!user || user.disabled) {
      return res.status(401).json({ error: 'user disabled or not found' })
    }

    req.decodedToken = decodedToken
    req.token = token
    next()
  } catch (error) {
    console.log(error)
    return res.status(401).json({ error: 'token invalid' })
  }
}

app.use(tokenExtractor)

// Pieni testireitti
app.get('/', (req, res) => {
  res.send('Osa13 backend toimii')
})

/**
 * BLOGIT
 * 13.6: PUT /api/blogs/:id (likes)
 * 13.10: blogin luonti kirjautuneelle käyttäjälle
 * 13.11: poisto vain omalta blogilta
 * 13.12: käyttäjä mukana
 * 13.13–13.15: hakufiltteri + järjestys likes DESC
 */

// GET /api/blogs ?search=...
app.get('/api/blogs', async (req, res, next) => {
  try {
    const where = {}

    if (req.query.search) {
      const search = req.query.search.toLowerCase()
      where[Op.or] = [
        {
          title: {
            [Op.iLike]: `%${search}%`
          }
        },
        {
          author: {
            [Op.iLike]: `%${search}%`
          }
        }
      ]
    }

    const blogs = await Blog.findAll({
      include: {
        model: User,
        attributes: ['id', 'username', 'name']
      },
      where,
      order: [['likes', 'DESC']]
    })

    res.json(blogs)
  } catch (error) {
    next(error)
  }
})

// POST /api/blogs – blogi kirjautuneelle käyttäjälle (13.10 + 13.24 disabled check)
app.post('/api/blogs', async (req, res, next) => {
  try {
    if (!req.decodedToken) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findByPk(req.decodedToken.id)
    if (!user || user.disabled) {
      return res.status(401).json({ error: 'user disabled or not found' })
    }

    const blog = await Blog.create({
      title: req.body.title,
      author: req.body.author,
      url: req.body.url,
      likes: req.body.likes ?? 0,
      userId: user.id
    })

    res.status(201).json(blog)
  } catch (error) {
    next(error)
  }
})

// PUT /api/blogs/:id – likejen päivitys (13.6)
app.put('/api/blogs/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (!blog) {
      return res.status(404).end()
    }

    if (typeof req.body.likes !== 'number') {
      return res.status(400).json({ error: 'likes must be a number' })
    }

    blog.likes = req.body.likes
    await blog.save()
    res.json(blog)
  } catch (error) {
    next(error)
  }
})

// DELETE /api/blogs/:id – vain blogin lisännyt käyttäjä voi poistaa (13.11)
app.delete('/api/blogs/:id', async (req, res, next) => {
  try {
    if (!req.decodedToken) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }

    const blog = await Blog.findByPk(req.params.id)
    if (!blog) {
      return res.status(404).end()
    }

    if (blog.userId !== req.decodedToken.id) {
      return res.status(403).json({ error: 'not allowed to delete this blog' })
    }

    await blog.destroy()
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

/**
 * /api/authors – 13.16
 */
app.get('/api/authors', async (req, res, next) => {
  try {
    const authors = await Blog.findAll({
      attributes: [
        'author',
        [fn('COUNT', col('id')), 'blogs'],
        [fn('SUM', col('likes')), 'likes']
      ],
      group: ['author'],
      order: [[fn('SUM', col('likes')), 'DESC']]
    })

    res.json(authors)
  } catch (error) {
    next(error)
  }
})

/**
 * KÄYTTÄJÄT – 13.8, 13.9, 13.12, 13.23
 */

// POST /api/users – uuden käyttäjän lisäys (13.8)
app.post('/api/users', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
})

// GET /api/users – kaikki käyttäjät + heidän bloginsa (13.12)
app.get('/api/users', async (req, res, next) => {
  try {
    const users = await User.findAll({
      include: {
        model: Blog,
        attributes: ['id', 'title', 'author', 'url', 'likes']
      }
    })
    res.json(users)
  } catch (error) {
    next(error)
  }
})

// PUT /api/users/:username – nimen muutos (13.8)
app.put('/api/users/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { username: req.params.username } })
    if (!user) {
      return res.status(404).end()
    }

    user.name = req.body.name
    await user.save()
    res.json(user)
  } catch (error) {
    next(error)
  }
})

// GET /api/users/:id – lukulista + ?read=true/false (13.23)
app.get('/api/users/:id', async (req, res, next) => {
  try {
    const readFilter = {}
    if (req.query.read === 'true') {
      readFilter.read = true
    } else if (req.query.read === 'false') {
      readFilter.read = false
    }

    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'name', 'username'],
      include: [
        {
          model: Blog,
          as: 'readings',
          attributes: ['id', 'url', 'title', 'author', 'likes', 'year'],
          through: {
            attributes: ['id', 'read'],
            where: Object.keys(readFilter).length ? readFilter : undefined
          }
        }
      ]
    })

    if (!user) {
      return res.status(404).json({ error: 'user not found' })
    }

    res.json(user)
  } catch (error) {
    next(error)
  }
})

/**
 * LOGIN & LOGOUT – 13.10 + 13.24
 */

// Login – luo tokenin ja session
app.post('/api/login', async (req, res, next) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ where: { username } })
    const passwordCorrect = password === 'salainen'

    if (!(user && passwordCorrect)) {
      return res.status(401).json({ error: 'invalid username or password' })
    }

    if (user.disabled) {
      return res.status(401).json({ error: 'user disabled' })
    }

    const userForToken = {
      username: user.username,
      id: user.id
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    // tallennetaan sessio (13.24)
    await Session.create({
      userId: user.id,
      token
    })

    res.status(200).send({
      token,
      username: user.username,
      name: user.name
    })
  } catch (error) {
    next(error)
  }
})

// Logout – poistaa sessionin (13.24)
app.delete('/api/logout', async (req, res, next) => {
  try {
    if (!req.decodedToken || !req.token) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }

    await Session.destroy({ where: { token: req.token } })
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

/**
 * READING LIST – 13.19–13.22
 */

// Lisää blogi reading listille
app.post('/api/readinglists', async (req, res, next) => {
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
    next(error)
  }
})

// Päivitä readinglist-rivin read-arvo – 13.22
app.put('/api/readinglists/:id', async (req, res, next) => {
  try {
    if (!req.decodedToken) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }

    const { read } = req.body
    const item = await ReadingList.findByPk(req.params.id)

    if (!item) {
      return res.status(404).json({ error: 'reading list item not found' })
    }

    if (item.userId !== req.decodedToken.id) {
      return res.status(403).json({ error: 'not allowed to modify this reading list item' })
    }

    item.read = read
    await item.save()

    res.json(item)
  } catch (error) {
    next(error)
  }
})

/**
 * VIRHEIDENKÄSITTELY – 13.7
 */

const errorHandler = (error, req, res, next) => {
  console.error(error)

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: error.errors.map(e => e.message)
    })
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: error.errors.map(e => e.message)
    })
  }

  return res.status(500).json({ error: 'something went wrong' })
}

app.use(errorHandler)

/**
 * KÄYNNISTYS
 */

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
