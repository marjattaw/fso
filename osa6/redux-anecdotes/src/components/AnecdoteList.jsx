import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const { anecdotes, filter } = useSelector((state) => state)

  const visible = anecdotes.filter(a =>
    a.content.toLowerCase().includes(filter.toLowerCase())
  )
  // Järjestys pysyy reducerissa, mutta suodatuksen jälkeen on ok näyttää sellaisenaan

  return (
    <div>
      {visible.map(anec => (
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
