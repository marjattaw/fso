// index.js
require('dotenv').config()

const express  = require('express')
const morgan   = require('morgan')
const cors     = require('cors')
const path     = require('path')
const fs       = require('fs')
const mongoose = require('mongoose')
const Person   = require('./models/person')

const app = express()

// middlewares
app.use(express.json())
app.use(cors())
morgan.token('body', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// --- tietokantayhteys ---
const uri = process.env.MONGODB_URI
if (!uri) {
  console.error('MONGODB_URI missing. Put it in .env (local) or Render env vars (prod).')
  process.exit(1)
}
mongoose
  .connect(uri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  })

// --- palvele staattiset tiedostot jos dist on olemassa ---
const distDir = path.join(__dirname, 'dist')
const hasDist = fs.existsSync(distDir)
if (hasDist) {
  app.use(express.static(distDir))
}

// ---------- API ----------

// /info – määrä kannasta
app.get('/info', async (_req, res, next) => {
  try {
    const count = await Person.countDocuments({})
    res.send(
      `<p>Phonebook has info for ${count} people</p>
       <p>${new Date()}</p>`
    )
  } catch (err) { next(err) }
})

// 3.13: kaikki kannasta
app.get('/api/persons', async (_req, res, next) => {
  try {
    const persons = await Person.find({})
    res.json(persons)
  } catch (err) { next(err) }
})

// yksittäinen id:llä
app.get('/api/persons/:id', async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id)
    if (person) res.json(person)
    else res.status(404).end()
  } catch (err) { next(err) }
})

// 3.15: poisto päivittyy kantaan
app.delete('/api/persons/:id', async (req, res, next) => {
  try {
    await Person.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } catch (err) { next(err) }
})

// 3.14: luo uusi kantaan
app.post('/api/persons', async (req, res, next) => {
  try {
    const { name, number } = req.body
    if (!name)   return res.status(400).json({ error: 'name missing' })
    if (!number) return res.status(400).json({ error: 'number missing' })

    const person = new Person({ name: String(name).trim(), number: String(number).trim() })
    const saved = await person.save()
    res.status(201).json(saved)
  } catch (err) { next(err) }
})
// ---------- /API ----------

// SPA catch-all (palvele index.html kaikkiin muihin kuin /api/*)
if (hasDist) {
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next()
    return res.sendFile(path.join(distDir, 'index.html'))
  })
} else {
  // 3.16: 404 unknown endpoint (jos ei palvella SPA:ta)
  app.use((req, res) => res.status(404).json({ error: 'unknown endpoint' }))
}

// 3.16: keskitetty virheenkäsittely
app.use((err, _req, res, _next) => {
  console.error(err.name, err.message)
  if (err.name === 'CastError')       return res.status(400).json({ error: 'malformatted id' })
  if (err.name === 'ValidationError') return res.status(400).json({ error: err.message })
  return res.status(500).json({ error: 'internal server error' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
