import { useState } from 'react'

// ⬇️ UUSI: Statistics omaksi komponentiksi (Appin ULKOPUOLELLE)
const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad
  const average = all === 0 ? 0 : (good - bad) / all
  const positive = all === 0 ? 0 : (good / all) * 100

  return (
    <div>
      <h2>Statistiikka</h2>
      <p>Hyvä {good}</p>
      <p>Neutraali {neutral}</p>
      <p>Huono {bad}</p>
      <p>Kaikki {all}</p>
      <p>Keskiarvo {average.toFixed(1)}</p>
      <p>Positiivisia {positive.toFixed(1)} %</p>
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>Anna palautetta</h1>
      <button onClick={() => setGood(good + 1)}>Hyvä</button>
      <button onClick={() => setNeutral(neutral + 1)}>Neutraali</button>
      <button onClick={() => setBad(bad + 1)}>Huono</button>

      {/* ⬇️ Käytetään eriytettyä Statistics-komponenttia */}
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
