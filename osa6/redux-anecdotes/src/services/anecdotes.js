const baseUrl = 'http://localhost:3001/anecdotes'

export const getAll = async () => {
  const res = await fetch(baseUrl)
  if (!res.ok) throw new Error('Fetch anecdotes failed')
  return await res.json()
}

export const createNew = async (content) => {
  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, votes: 0 })
  })
  if (!res.ok) throw new Error('Create anecdote failed')
  return await res.json()
}

// (Vapaaehtoinen jatkoon: äänen päivitys)
// export const updateVotes = async (anec) => {
//   const res = await fetch(`${baseUrl}/${anec.id}`, {
//     method: 'PATCH',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ votes: anec.votes + 1 })
//   })
//   return await res.json()
// }
