import { useState } from 'react'

const Persons = ({ persons }) => (
  <ul>
    {persons.map(p => <li key={p.name}>{p.name}</li>)}
  </ul>
)

const PersonForm = ({ onSubmit, newName, onNameChange }) => (
  <form onSubmit={onSubmit}>
    <div>name: <input value={newName} onChange={onNameChange} /></div>
    <div><button type="submit">add</button></div>
  </form>
)

export default function App() {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' },
    { name: 'Ada Lovelace' },
    { name: 'Dan Abramov' },
  ])
  const [newName, setNewName] = useState('')

  const addPerson = (e) => {
    e.preventDefault()
    const name = newName.trim()
    if (!name) return
    setPersons(persons.concat({ name }))
    setNewName('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <PersonForm onSubmit={addPerson} newName={newName} onNameChange={e => setNewName(e.target.value)} />
      <h3>Numbers</h3>
      <Persons persons={persons} />
    </div>
  )
}
