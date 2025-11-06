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

// 6.18: päivitä äänet backendissä
export const updateVotes = async (anec) => {
  const res = await fetch(`${baseUrl}/${anec.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ votes: anec.votes + 1 })
  })
  if (!res.ok) throw new Error('Vote update failed')
  return await res.json()
}
