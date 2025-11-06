import { createSlice } from '@reduxjs/toolkit'

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
].map(a => ({ id: getId(), content: a, votes: 0 }))

const byVotesDesc = (a, b) => b.votes - a.votes

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: initialAnecdotes.sort(byVotesDesc),
  reducers: {
    voteAnecdote(state, action) {
      const id = action.payload
      return state
        .map(a => a.id !== id ? a : { ...a, votes: a.votes + 1 })
        .sort(byVotesDesc)
    },
    createAnecdote(state, action) {
      const content = action.payload
      return [...state, { id: getId(), content, votes: 0 }].sort(byVotesDesc)
    },
  },
})

export const { voteAnecdote, createAnecdote } = anecdoteSlice.actions
export default anecdoteSlice.reducer
