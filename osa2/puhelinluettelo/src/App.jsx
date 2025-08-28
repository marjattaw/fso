import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

export default function App() {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const addPerson = (e) => {
    e.preventDefault()
    const name = newName.trim()
    const number = newNumber.trim()
    if (!name || !number) return

    const exists = persons.some(p => p.name.toLowerCase() === name.toLowerCase())
    if (exists) {
      alert(`${name} is already added to phonebook`)
      return
    }

    setPersons(persons.concat({ name, number }))
    setNewName('')
    setNewNumber('')
  }

  const personsToShow = persons.filter(p =>
    p.name.toLowerCase().includes(filter.trim().toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter value={filter} onChange={e => setFilter(e.target.value)} />

      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        onNameChange={e => setNewName(e.target.value)}
        newNumber={newNumber}
        onNumberChange={e => setNewNumber(e.target.value)}
      />

      <h3>Numbers</h3>
      <Persons persons={personsToShow} />
    </div>
  )
}
