// src/services/login.js
import axios from 'axios'

const baseUrl = 'http://localhost:3003/api/login'

const login = async (credentials) => {
  const res = await axios.post(baseUrl, credentials)
  return res.data   // { token, username, name }
}

export default { login }
