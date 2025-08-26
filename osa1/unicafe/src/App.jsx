import { useState } from 'react'

// Yksi nappi
const Button = ({ onClick, text }) => (
  <button onClick={onClick}>{text}</button>
)

// Yksi tilastorivi TAULUKKOON
const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad
  if (all === 0) {
    return (
      <div>
        <h2>Statistiikka</h2>
        <p>Ei yhtään palautetta</p>
      </div>
    )
  }

  const average = (good - bad) / all
  const positive = (good / all) * 100

  return (
    <div>
      <h2>statistiikka</h2>
      <table>
        <tbody>
          <StatisticLine text="Hyvä" value={good} />
          <StatisticLine text="Neutraali" value={neutral} />
          <StatisticLine text="Huono" value={bad} />
          <StatisticLine text="Kaikki" value={all} />
          <StatisticLine text="Keskiarvo" value={average.toFixed(1)} />
          <StatisticLine text="Positiivisia" value={`${positive.toFixed(1)} %`} />
        </tbody>
      </table>
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
      <Button onClick={() => setGood(good + 1)} text="Hyvä" />
      <Button onClick={() => setNeutral(neutral + 1)} text="Neutraali" />
      <Button onClick={() => setBad(bad + 1)} text="Huono" />

      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
