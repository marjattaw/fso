import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdoteAsync } from '../reducers/anecdoteSlice'
import { setNotification } from '../reducers/notificationSlice'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const { anecdotes, filter } = useSelector((s) => s)

  const visible = anecdotes.filter(a =>
    a.content.toLowerCase().includes(filter.toLowerCase())
  )

  const handleVote = (anec) => {
    dispatch(voteAnecdoteAsync(anec))
    dispatch(setNotification(`you voted '${anec.content}'`, 5))
  }

  return (
    <div>
      {visible.map(anec => (
        <div key={anec.id} style={{ marginBottom: 12 }}>
          <div>{anec.content}</div>
          <div>
            has {anec.votes} votes{' '}
            <button onClick={() => handleVote(anec)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}
export default AnecdoteList
