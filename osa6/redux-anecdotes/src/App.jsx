import Notification from './components/Notification'
import Filter from './components/Filter'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'

const App = () => (
  <div style={{ padding: 16, maxWidth: 800 }}>
    <h2>Anecdotes</h2>
    <Notification />
    <Filter />
    <AnecdoteForm />
    <AnecdoteList />
  </div>
)

export default App
