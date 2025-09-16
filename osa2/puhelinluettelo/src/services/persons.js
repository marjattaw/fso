import axios from 'axios'

// DEV (kun frontti ja backend eri porteissa, esim. 5173 & 3001):
// const baseUrl = 'http://localhost:3001/api/persons'

// PROD (kun frontti palvellaan samasta hostista kuin backend, esim. Render):
const baseUrl = '/api/persons'

const getAll = () =>
  axios.get(baseUrl).then(res => res.data)

const create = (newPerson) =>
  axios.post(baseUrl, newPerson).then(res => res.data)

// 3.17 asti ei käytössä – älä kutsu tätä (valmiina myöhemmin)
const update = (id, updatedPerson) =>
  axios.put(`${baseUrl}/${id}`, updatedPerson).then(res => res.data)

const remove = (id) =>
  axios.delete(`${baseUrl}/${id}`).then(res => res.data)

export default { getAll, create, update, remove }
