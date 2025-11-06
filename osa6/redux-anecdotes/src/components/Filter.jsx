import { useDispatch, useSelector } from 'react-redux'
import { setFilter } from '../reducers/filterReducer'

const Filter = () => {
  const dispatch = useDispatch()
  const value = useSelector((s) => s.filter)

  const handleChange = (event) => {
    dispatch(setFilter(event.target.value))
  }

  return (
    <div style={{ marginBottom: 10 }}>
      filter <input value={value} onChange={handleChange} />
    </div>
  )
}

export default Filter
