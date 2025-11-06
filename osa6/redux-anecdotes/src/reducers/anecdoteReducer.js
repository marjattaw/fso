// 6.6: action creatorit ja reducer samaan tiedostoon

// Pieni apuri id:lle (kurssin pohjassa on usein vastaava funktio)
const getId = () => (100000 * Math.random()).toFixed(0)

const initialAnecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...'
  + 'The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place.'
  + ' Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const asObject = (content) => {
  return {
    content,
    votes: 0,
    id: getId()
  }
}

// --- ACTION CREATORS ---
export const voteAnecdote = (id) => {
  return {
    type: 'anecdotes/vote',
    payload: { id }
  }
}

export const createAnecdote = (content) => {
  return {
    type: 'anecdotes/create',
    payload: { anecdote: asObject(content) }
  }
}

// --- REDUCER ---
const anecdoteReducer = (state = initialAnecdotes.map(asObject), action) => {
  switch (action.type) {
    case 'anecdotes/vote': {
      const id = action.payload.id
      const updated = state.map(a =>
        a.id !== id ? a : { ...a, votes: a.votes + 1 }
      )
      // 6.5: pidä järjestys aina äänien mukaan
      return [...updated].sort((a, b) => b.votes - a.votes)
    }
    case 'anecdotes/create': {
      const created = [...state, action.payload.anecdote]
      return created.sort((a, b) => b.votes - a.votes)
    }
    default:
      return state
  }
}

export default anecdoteReducer
