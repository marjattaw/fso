import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
export const setToken = (newToken) => {
  token = newToken ? `Bearer ${newToken}` : null
}
const auth = () => (token ? { headers: { Authorization: token } } : {})

const getAll = async () => {
  const { data } = await axios.get(baseUrl)
  return data
}

const create = async (blog) => {
  const { data } = await axios.post(baseUrl, blog, auth())
  return data
}

// 5.8: like (= update)
const update = async (id, blog) => {
  const { data } = await axios.put(`${baseUrl}/${id}`, blog, auth())
  return data
}

// 5.11: delete
const remove = async (id) => {
  await axios.delete(`${baseUrl}/${id}`, auth())
}

export default { getAll, create, update, remove }
