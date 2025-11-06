import { createSlice } from '@reduxjs/toolkit'
import * as api from '../services/anecdotes'

const byVotesDesc = (a, b) => b.votes - a.votes

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [], // 6.16: täytetään backendistä
  reducers: {
    setAnecdotes(_state, action) {
      return [...action.payload].sort(byVotesDesc)
    },
    appendAnecdote(state, action) {
      return [...state, action.payload].sort(byVotesDesc)
    },
    replaceAnecdote(state, action) {
      const updated = action.payload
      return state
        .map(a => a.id !== updated.id ? a : updated)
        .sort(byVotesDesc)
    },
  },
})

export const { setAnecdotes, appendAnecdote, replaceAnecdote } =
  anecdoteSlice.actions

export default anecdoteSlice.reducer

// ---------- THUNKIT ----------

// 6.16: alustus backendistä
export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const data = await api.getAll()
    dispatch(setAnecdotes(data))
  }
}

// 6.17: luonti backendissä
export const createAnecdoteAsync = (content) => {
  return async (dispatch) => {
    const created = await api.createNew(content)
    dispatch(appendAnecdote(created))
  }
}

// 6.18: äänestys backendissä
export const voteAnecdoteAsync = (anec) => {
  return async (dispatch) => {
    const updated = await api.updateVotes(anec)
    dispatch(replaceAnecdote(updated))
  }
}
