import { createContext, useContext, useReducer, useRef } from 'react'

const NotificationContext = createContext()

const reducer = (_state, action) => {
  switch (action.type) {
    case 'SHOW':
      return action.payload          // string
    case 'HIDE':
      return ''
    default:
      return _state
  }
}

export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(reducer, '')
  const timerRef = useRef(null)

  const notify = (message, seconds = 5) => {
    dispatch({ type: 'SHOW', payload: message })
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      dispatch({ type: 'HIDE' })
      timerRef.current = null
    }, seconds * 1000)
  }

  return (
    <NotificationContext.Provider value={{ notification, notify }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => useContext(NotificationContext)
