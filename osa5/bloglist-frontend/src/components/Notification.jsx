export default function Notification({ message }) {
  if (!message) return null
  const ok = message.type !== 'error'
  const style = {
    padding: '10px 12px',
    border: '2px solid',
    borderColor: ok ? 'seagreen' : 'crimson',
    color: ok ? 'seagreen' : 'crimson',
    background: '#f6f6f6',
    borderRadius: 6,
    marginBottom: 16
  }
  return <div style={style}>{message.text}</div>
}
