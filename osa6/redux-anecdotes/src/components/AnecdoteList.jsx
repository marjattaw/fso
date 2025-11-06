import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state) // reducer palauttaa pelkän listan

  return (
    <div>
      {anecdotes.map(anec => (
        <div key={anec.id} style={{ marginBottom: 12 }}>
          <div>{anec.content}</div>
          <div>
            has {anec.votes} votes{' '}
            <button onClick={() => dispatch(voteAnecdote(anec.id))}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
