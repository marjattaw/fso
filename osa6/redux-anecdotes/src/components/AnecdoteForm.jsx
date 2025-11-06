import { useDispatch } from 'react-redux'
import { createAnecdoteAsync } from '../reducers/anecdoteSlice'
import { setNotification } from '../reducers/notificationSlice'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value.trim()
    if (!content) return
    await dispatch(createAnecdoteAsync(content))          // 6.15: POST backend
    dispatch(setNotification(`You created '${content}'`, 5))
    e.target.reset()
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
