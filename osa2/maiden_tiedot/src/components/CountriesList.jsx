export default function CountriesList({ countries, onShow }) {
  if (!countries.length) return <p>No matches</p>
  return (
    <ul>
      {countries.map(c => (
        <li key={c.cca3}>
          {c.name.common} <button onClick={() => onShow(c.cca3)}>Show</button>
        </li>
      ))}
    </ul>
  )
}
