import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../services/anecdotes'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (created) => {
      // lisää suoraan välimuistiin
      queryClient.setQueryData(['anecdotes'], (old = []) => [...old, created])
      // vaihtoehto: queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
  })

  const onCreate = (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value.trim()
    if (!content) return
    createMutation.mutate(content)
    e.target.reset()
  }

  return (
    <form onSubmit={onCreate} style={{ marginBottom: 16 }}>
      <h3>create new</h3>
      <input name="anecdote" />
      <button type="submit" style={{ marginLeft: 8 }}>create</button>
    </form>
  )
}

export default AnecdoteForm
