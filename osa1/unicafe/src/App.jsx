import { useState } from 'react'

const App = () => {
  // tallentaa napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>Anna palautetta</h1>
      <button onClick={() => setGood(good + 1)}>hyvä</button>
      <button onClick={() => setNeutral(neutral + 1)}>neutraali</button>
      <button onClick={() => setBad(bad + 1)}>huono</button>

      <h2> Statistiikka</h2>
      <p> Hyvä {good}</p>
      <p> Neutraali {neutral}</p>
      <p> Huono {bad}</p>
    </div>
  )
}

export default App
