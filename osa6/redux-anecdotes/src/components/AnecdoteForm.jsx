import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../services/anecdotes'
import { useNotification } from '../NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const { notify } = useNotification()

  const createMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (created) => {
      queryClient.setQueryData(['anecdotes'], (old = []) => [...old, created])
      notify(`anecdote '${created.content}' created`, 5)
    },
    // 6.24: virhe jos sisältö < 5 merkkiä
    onError: () => {
      notify('too short anecdote, must have length 5 or more', 5)
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
