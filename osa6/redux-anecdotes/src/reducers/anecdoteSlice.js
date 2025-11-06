import { createSlice } from '@reduxjs/toolkit'
import * as api from '../services/anecdotes'

const byVotesDesc = (a, b) => b.votes - a.votes

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],                  // 6.14: ladataan backendistä
  reducers: {
    setAnecdotes(_state, action) {
      return [...action.payload].sort(byVotesDesc)
    },
    appendAnecdote(state, action) {
      return [...state, action.payload].sort(byVotesDesc)
    },
    voteAnecdote(state, action) {
      const id = action.payload
      return state
        .map(a => a.id !== id ? a : { ...a, votes: a.votes + 1 })
        .sort(byVotesDesc)
    },
    createAnecdoteLocal(state, action) {
      // jää varalle, jos haluat luoda ilman backendia
      return [...state, action.payload].sort(byVotesDesc)
    },
  },
})

export const { setAnecdotes, appendAnecdote, voteAnecdote, createAnecdoteLocal } =
  anecdoteSlice.actions
export default anecdoteSlice.reducer

// ---------- THUNKIT (Fetch API) ----------

// 6.14: hae kaikki käynnistyksessä
export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const data = await api.getAll()
    dispatch(setAnecdotes(data))
  }
}

// 6.15: luo uusi backendissä
export const createAnecdoteAsync = (content) => {
  return async (dispatch) => {
    const created = await api.createNew(content)
    dispatch(appendAnecdote(created))
  }
}
