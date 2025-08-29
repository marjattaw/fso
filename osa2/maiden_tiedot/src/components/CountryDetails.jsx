import { useEffect, useState } from 'react'
import axios from 'axios'

export default function CountryDetails({ country }) {
  const [weather, setWeather] = useState(null)

  const name = country.name.common
  const capital = country.capital?.[0] || 'N/A'
  const area = country.area
  const languages = country.languages ? Object.values(country.languages) : []
  const flagSrc = country.flags?.png || country.flags?.svg
  const flagAlt = country.flags?.alt || `Flag of ${name}`

  const [lat, lon] = country.capitalInfo?.latlng || []

  useEffect(() => {
    setWeather(null)
    if (lat == null || lon == null) return

    axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: lat,
        longitude: lon,
        current_weather: true, // palauttaa lämpötilan ja tuulen
      },
    })
    .then(res => setWeather(res.data.current_weather))
    .catch(() => setWeather({ error: true }))
  }, [lat, lon, country.cca3])

  return (
    <div>
      <h1>{name}</h1>
      <p>Capital {capital}</p>
      <p>Area {area}</p>

      <h3>Languages</h3>
      <ul>{languages.map(l => <li key={l}>{l}</li>)}</ul>

      {flagSrc && <img src={flagSrc} alt={flagAlt} width="160" />}

      <h3>Weather in {capital}</h3>
      {!weather && <p>Loading weather…</p>}
      {weather && !weather.error && (
        <div>
          <p>Temperature {Math.round(weather.temperature)} Celsius</p>
          <p>Wind {weather.windspeed} m/s</p>
        </div>
      )}
      {weather?.error && <p>Weather unavailable.</p>}
    </div>
  )
}
