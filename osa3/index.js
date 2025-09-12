const express = require('express')
const app = express()

const persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
]

// 3.2: info-sivu (määrä + kellonaika)
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
    persons.splice(idx, 1)   // poista 1 alkio kohdasta idx
  }
  // Kurssin ohjeiden mukaan 204 riittää, vaikka id:tä ei löytyisi
  res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
