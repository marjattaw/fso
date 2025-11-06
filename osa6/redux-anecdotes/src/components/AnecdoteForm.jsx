import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const handleSubmit = (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value.trim()
    if (!content) return
    dispatch(createAnecdote(content))
    e.target.reset() // ei-kontrolloitu input
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
      <div>
        <input name="anecdote" placeholder="write new anecdote" />
        <button type="submit" style={{ marginLeft: 8 }}>create</button>
      </div>
    </form>
  )
}

export default AnecdoteForm
