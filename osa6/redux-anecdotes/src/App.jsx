import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { getAnecdotes, voteAnecdote } from './services/anecdotes'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useNotification } from './NotificationContext'

const App = () => {
  const queryClient = useQueryClient()
  const { notify } = useNotification()

  // 6.20: haku (voit vaihtaa retry: 0/1)
  const {
    data: anecdotes = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1,
  })

  // 6.22 (+ 6.23 ilmoitus): äänestys mutaationa
  const voteMutation = useMutation({
    mutationFn: voteAnecdote,
    onSuccess: (updated) => {
      // päivitä välimuisti ilman refetchausta
      queryClient.setQueryData(['anecdotes'], (old = []) =>
        old.map((a) => (a.id === updated.id ? updated : a))
      )
      notify(`you voted '${updated.content}'`, 5)
    },
  })

  const handleVote = (anec) => {
    voteMutation.mutate(anec)
  }

  if (isLoading) return <div>loading data...</div>

  // 6.20: virhesivu kun palvelin ei vastaa
  if (isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  return (
    <div style={{ padding: 16, maxWidth: 800 }}>
      <h2>Anecdotes</h2>

      <Notification />

      <AnecdoteForm />

      {anecdotes.map((a) => (
        <div key={a.id} style={{ marginBottom: 10 }}>
          <div>{a.content}</div>
          <div>
            has {a.votes}{' '}
            <button onClick={() => handleVote(a)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
