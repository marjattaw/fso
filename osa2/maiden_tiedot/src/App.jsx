import { useEffect, useState } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import CountriesList from './components/CountriesList'
import CountryDetails from './components/CountryDetails'

export default function App() {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selected, setSelected] = useState(null)

  // Hae kaikki maat kerran (2.18)
  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(res => setCountries(res.data))
  }, [])

  const matches = countries.filter(c =>
    c.name.common.toLowerCase().includes(filter.trim().toLowerCase())
  )

  // Kun haun tulos on yksi, näytä se; muuten näytä "Show"-napin valitsema
  const countryToShow = selected || (matches.length === 1 ? matches[0] : null)

  // Päivitä valinta napista (2.19)
  const handleShow = (cca3) => {
    const c = countries.find(x => x.cca3 === cca3)
    setSelected(c)
  }

  // Tyhjennä valinta jos suodatin ei enää osu valittuun maahan
  useEffect(() => {
    if (selected && !selected.name.common.toLowerCase().includes(filter.trim().toLowerCase())) {
      setSelected(null)
    }
  }, [filter, selected])

  return (
    <div>
      <Filter value={filter} onChange={e => setFilter(e.target.value)} />

      {matches.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : countryToShow ? (
        <CountryDetails country={countryToShow} />
      ) : (
        <CountriesList countries={matches} onShow={handleShow} />
      )}
    </div>
  )
}
