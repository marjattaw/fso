import { useState } from 'react'

export default function BlogForm({ onCreate }) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    await onCreate({ title, author, url })
    setTitle(''); setAuthor(''); setUrl('')
  }

  return (
    <form onSubmit={submit} style={{ marginBottom: 12 }}>
      <div>
        <label>title <input value={title} onChange={e=>setTitle(e.target.value)} /></label>
      </div>
      <div>
        <label>author <input value={author} onChange={e=>setAuthor(e.target.value)} /></label>
      </div>
      <div>
        <label>url <input value={url} onChange={e=>setUrl(e.target.value)} /></label>
      </div>
      <button type="submit" style={{ marginTop: 8 }}>create</button>
    </form>
  )
}
