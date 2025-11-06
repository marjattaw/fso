const baseUrl = 'http://localhost:3001/anecdotes'

export async function getAnecdotes() {
  const res = await fetch(baseUrl)
  if (!res.ok) throw new Error('fetch failed')
  return res.json()
}

export async function createAnecdote(content) {
  // Palvelin hylkää alle 5 merkkiä → antaa 400, ei tarvitse käsitellä nyt
  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, votes: 0 })
  })
  if (!res.ok) throw new Error('create failed')
  return res.json()
}

export async function voteAnecdote(anec) {
  const res = await fetch(`${baseUrl}/${anec.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ votes: anec.votes + 1 })
  })
  if (!res.ok) throw new Error('vote failed')
  return res.json()
}
