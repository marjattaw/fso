import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '', // 6.12: jokin alkuteksti mahdollista
  reducers: {
    show(state, action) {
      return action.payload  // viestinä string
    },
    hide() {
      return ''
    },
  },
})

// thunk-helppari 6.13: näyttää viestin n sekuntia
export const setNotification = (message, seconds = 5) => {
  return async (dispatch) => {
    dispatch(show(message))
    // yksinkertainen timeout; viimeisin korvaa aiemman
    clearTimeout(window.__notifTimeout)
    window.__notifTimeout = setTimeout(() => {
      dispatch(hide())
    }, seconds * 1000)
  }
}

export const { show, hide } = notificationSlice.actions
export default notificationSlice.reducer
