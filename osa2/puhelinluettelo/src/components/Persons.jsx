const Persons = ({ persons }) => (
  <ul>
    {persons.map(p => (
      <li key={p.name}>{p.name} {p.number}</li>
    ))}
  </ul>
)

export default Persons
