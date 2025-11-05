// src/App.jsx
import { useEffect, useRef, useState } from 'react'
import blogsService, { setToken as setBlogsToken } from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/Blog'
import Blog from './components/Blog' // HUOM: jos BlogForm on omassa tiedostossa, vaihda import oikein

export default function App() {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)

  const notify = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 4000)
  }

  const formRef = useRef()

  useEffect(() => {
    blogsService.getAll().then(data => {
      setBlogs([...data].sort((a, b) => (b.likes || 0) - (a.likes || 0)))
    })
  }, [])

  useEffect(() => {
    const json = window.localStorage.getItem('loggedBloglistUser')
    if (json) {
      const u = JSON.parse(json)
      setUser(u)
      setBlogsToken(u.token)
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const u = await loginService.login({ username, password })
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

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
    setBlogsToken(null)
    notify('Logged out')
  }

  // 5.6 + 5.5: uuden blogin luonti & lomakkeen sulkeminen
  const createBlog = async ({ title, author, url }) => {
    try {
      const created = await blogsService.create({ title, author, url })
      setBlogs(prev => {
        const next = prev.concat(created)
        return next.sort((a, b) => (b.likes || 0) - (a.likes || 0))
      })
      notify(`a new blog "${created.title}" by ${created.author} added`)
      formRef.current?.toggleVisibility()
    } catch (err) {
      const apiMsg = err?.response?.data?.error
      notify(apiMsg || 'failed to add blog', 'error')
    }
  }

  // 5.8 + 5.9: like – säilytä user-populate jos backend ei palauta sitä
  const likeBlog = async (blog) => {
    const payload = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: (blog.likes || 0) + 1,
      user: blog.user?.id || blog.user
    }
    const updated = await blogsService.update(blog.id, payload)
    const fixed = { ...updated, user: blog.user }

    setBlogs(prev => {
      const next = prev.map(b => (b.id !== blog.id ? b : fixed))
      return next.sort((a, b) => (b.likes || 0) - (a.likes || 0))
    })
  }

  // 5.11: delete (vain lisääjä näkee Blog-komponentissa)
  const deleteBlog = async (blog) => {
    if (!window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) return
    try {
      await blogsService.remove(blog.id)
      setBlogs(prev => prev.filter(b => b.id !== blog.id))
      notify(`deleted "${blog.title}"`)
    } catch (err) {
      const apiMsg = err?.response?.data?.error
      notify(apiMsg || 'failed to delete blog', 'error')
    }
  }

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
                onChange={e => setUsername(e.target.value)}
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
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </label>
          </div>
          <button type="submit" style={{ marginTop: 12 }}>login</button>
        </form>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 720, margin: '2rem auto', fontFamily: 'system-ui, sans-serif' }}>
      <h2>blogs</h2>
      <Notification message={message} />
      <p>
        {user.name} logged in{' '}
        <button onClick={handleLogout}>logout</button>
      </p>

      {/* 5.5–5.6: piilotettava luontilomake */}
      <Togglable buttonLabel="create new blog" ref={formRef}>
        <BlogForm onCreate={createBlog} />
      </Togglable>

      {blogs.map(b => (
        <Blog
          key={b.id}
          blog={b}
          currentUser={user}
          onLike={likeBlog}
          onDelete={deleteBlog}
        />
      ))}
    </div>
  )
}
