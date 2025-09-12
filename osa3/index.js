const express = require('express')
const morgan = require('morgan')
const cors = require('cors')              // <-- uusi
const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())                           // <-- sallii pyynnöt eri originista

let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
]

app.get('/info', (req, res) => {
  const count = persons.length
  res.send(
    `<p>Phonebook has info for ${count} people</p>
     <p>${new Date()}</p>`
  )
})

app.get('/api/persons', (req, res) => { res.json(persons) })

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = persons.find(p => p.id === id)
  if (person) res.json(person)
  else res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const idx = persons.findIndex(p => p.id === id)
  if (idx !== -1) persons.splice(idx, 1)
  res.status(204).end()
})

function generateId() {
  let id
  do { id = String(Math.floor(100000000 + Math.random() * 900000000)) }
  while (persons.some(p => p.id === id))
  return id
}

app.post('/api/persons', (req, res) => {
  const body = req.body
  if (!body?.name) return res.status(400).json({ error: 'name missing' })
  if (!body?.number) return res.status(400).json({ error: 'number missing' })
  const exists = persons.some(p => p.name.trim().toLowerCase() === body.name.trim().toLowerCase())
  if (exists) return res.status(400).json({ error: 'name must be unique' })

  const newPerson = { id: generateId(), name: body.name.trim(), number: body.number.trim() }
  persons.push(newPerson)
  res.status(201).json(newPerson)
})

const PORT = 3001
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`) })
