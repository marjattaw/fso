const express = require('express')
const app = express()

// jotta request.body toimii JSONille
app.use(express.json())

const persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
]

// 3.2: info-sivu
app.get('/info', (req, res) => {
  const count = persons.length
  const time = new Date()
  res.send(
    `<p>Phonebook has info for ${count} people</p>
     <p>${time}</p>`
  )
})

// 3.1: kaikki henkilöt
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// 3.3: yksittäinen henkilötieto id:llä
app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = persons.find(p => p.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

// 3.4: poista henkilötieto id:llä
app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const idx = persons.findIndex(p => p.id === id)
  if (idx !== -1) {
    persons.splice(idx, 1)
  }
  res.status(204).end()
})

// --- 3.5: POST /api/persons (luo uusi) ---

// Luo satunnainen merkkijono-id ja varmista ettei törmää.
function generateId() {
  let id
  do {
    // 9-numeroinen alue: 100000000…999999999
    id = String(Math.floor(100000000 + Math.random() * 900000000))
  } while (persons.some(p => p.id === id))
  return id
}

app.post('/api/persons', (req, res) => {
  const body = req.body   // odotetaan JSONia: { name, number }

  // 3.5: tässä vaiheessa ei vielä tehdä validointeja (tulee 3.6:ssa)
  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons.push(newPerson)
  // 201 Created on hyvä käytäntö, 200 käy myös
  res.status(201).json(newPerson)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
