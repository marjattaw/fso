import { useEffect, useState } from 'react'
import personsService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'   // <-- UUSI

export default function App() {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)         // <-- UUSI

  const notify = (text, type = 'success') => {         // <-- UUSI
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 4000)
  }

  // 2.11: hae alkudata palvelimelta
  useEffect(() => {
    personsService.getAll().then(data => setPersons(data))
  }, [])

  // 2.12 + 2.15*: lisää uusi tai päivitä olemassa olevan numero
  const addPerson = (e) => {
    e.preventDefault()
    const name = newName.trim()
    const number = newNumber.trim()
    if (!name || !number) return

    const existing = persons.find(p => p.name.toLowerCase() === name.toLowerCase())

    if (existing) {
      if (window.confirm(
        `${existing.name} is already added to phonebook, replace the old number with a new one?`
      )) {
        personsService
          .update(existing.id, { ...existing, number })
          .then(returned => {
            setPersons(prev => prev.map(p => (p.id !== existing.id ? p : returned)))
            setNewName('')
            setNewNumber('')
            notify(`Updated ${returned.name}`)              // <-- UUSI
          })
          .catch(() => {
            notify(`Information of ${existing.name} has already been removed from server`, 'error') // <-- UUSI
            setPersons(prev => prev.filter(p => p.id !== existing.id))
          })
      }
      return
    }

    // 2.12: uusi henkilö (POST)
    personsService
      .create({ name, number })
      .then(returned => {
        setPersons(prev => prev.concat(returned))
        setNewName('')
        setNewNumber('')
        notify(`Added ${returned.name}`)                   // <-- UUSI
      })
      .catch(() => {
        notify('Failed to create person', 'error')         // <-- UUSI
      })
  }

  // 2.14: poisto (DELETE)
  const handleDelete = (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return
    personsService
      .remove(id)
      .then(() => {
        setPersons(prev => prev.filter(p => p.id !== id))
        notify(`Deleted ${name}`)                          // <-- UUSI
      })
      .catch(() => {
        notify(`${name} was already removed from server`, 'error') // <-- UUSI
        setPersons(prev => prev.filter(p => p.id !== id))
      })
  }

  const personsToShow = persons.filter(p =>
    p.name.toLowerCase().includes(filter.trim().toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} /> {/* <-- UUSI */}

      <Filter value={filter} onChange={e => setFilter(e.target.value)} />

      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        onNameChange={e => setNewName(e.target.value)}
        newNumber={newNumber}
        onNumberChange={e => setNewNumber(e.target.value)}
      />

      <h3>Numbers</h3>
      <Persons persons={personsToShow} onDelete={handleDelete} />
    </div>
  )
}
