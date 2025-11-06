// tila on pelkkä merkkijono
const initialState = ''

// action creator
export const setFilter = (value) => {
  return {
    type: 'filter/set',
    payload: value,
  }
}

const filterReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'filter/set':
      return action.payload
    default:
      return state
  }
}

export default filterReducer
