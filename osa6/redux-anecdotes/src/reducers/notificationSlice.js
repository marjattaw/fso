import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    show(_state, action) {
      return action.payload
    },
    hide() {
      return ''
    },
  },
})

export const { show, hide } = notificationSlice.actions
export default notificationSlice.reducer

// parempi API: setNotification(message, seconds)
let timeoutId
export const setNotification = (message, seconds = 5) => {
  return (dispatch) => {
    dispatch(show(message))
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => dispatch(hide()), seconds * 1000)
  }
}
