// src/App.jsx
import { useEffect, useState } from 'react'
import blogsService, { setToken as setBlogsToken } from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

export default function App() {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [title, setTitle]   = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl]       = useState('')

  const [message, setMessage] = useState(null)

  const notify = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 4000)
  }

  // Lataa blogit
  useEffect(() => {
    blogsService.getAll().then(setBlogs)
  }, [])

  // Palauta kirjautuminen localStoragesta (5.2)
  useEffect(() => {
    const json = window.localStorage.getItem('loggedBloglistUser')
    if (json) {
      const u = JSON.parse(json)
      setUser(u)
      setBlogsToken(u.token)
    }
  }, [])

  // 5.1: kirjautuminen
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const u = await loginService.login({ username, password })
      // talteen selaimeen (5.2)
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(u))
      setBlogsToken(u.token)
      setUser(u)
      setUsername('')
      setPassword('')
      notify(`Welcome ${u.name}!`)
    } catch (err) {
      const apiMsg = err?.response?.data?.error
      notify(apiMsg || 'wrong username/password', 'error')
    }
  }

  // 5.2: uloskirjautuminen
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
    setBlogsToken(null)
    notify('Logged out')
  }

  // 5.3: blogin lisäys (token headerissa)
  const addBlog = async (e) => {
    e.preventDefault()
    try {
      const created = await blogsService.create({ title, author, url })
      setBlogs((prev) => prev.concat(created))
      setTitle('')
      setAuthor('')
      setUrl('')
      notify(`a new blog "${created.title}" by ${created.author} added`)
    } catch (err) {
      const apiMsg = err?.response?.data?.error
      notify(apiMsg || 'failed to add blog', 'error')
    }
  }

  // Ei kirjautunut → näytä login-lomake
  if (!user) {
    return (
      <div style={{ maxWidth: 560, margin: '2rem auto', fontFamily: 'system-ui, sans-serif' }}>
        <h2>Log in to application</h2>
        <Notification message={message} />
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </label>
          </div>
          <div style={{ marginTop: 8 }}>
            <label>
              password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </label>
          </div>
          <button type="submit" style={{ marginTop: 12 }}>login</button>
        </form>
      </div>
    )
  }

  // Kirjautunut → listaa blogit ja tarjoa lisäyslomake
  return (
    <div style={{ maxWidth: 720, margin: '2rem auto', fontFamily: 'system-ui, sans-serif' }}>
      <h2>blogs</h2>
      <Notification message={message} />

      <p>
        {user.name} logged in{' '}
        <button onClick={handleLogout}>logout</button>
      </p>

      <h3>Create new</h3>
      <form onSubmit={addBlog} style={{ marginBottom: 18 }}>
        <div>
          <label>
            title{' '}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Blog title"
            />
          </label>
        </div>
        <div>
          <label>
            author{' '}
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Blog author"
            />
          </label>
        </div>
        <div>
          <label>
            url{' '}
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </label>
        </div>
        <button type="submit" style={{ marginTop: 8 }}>create</button>
      </form>

      {blogs.map((b) => (
        <div
          key={b.id}
          style={{
            padding: 8,
            border: '1px solid #ddd',
            borderRadius: 6,
            marginBottom: 8
          }}
        >
          <strong>{b.title}</strong> — {b.author}
        </div>
      ))}
    </div>
  )
}
