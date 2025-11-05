import { useState } from 'react'

export default function Blog({ blog, currentUser, onLike, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const blogStyle = {
    padding: 10,
    paddingLeft: 8,
    border: '1px solid #ddd',
    borderRadius: 6,
    marginBottom: 8
  }

  const toggle = () => setExpanded(v => !v)
  const canDelete = currentUser && blog.user && (
    blog.user.username === currentUser.username
  )

  return (
    <div style={blogStyle} className="blog">
      <div>
        <strong>{blog.title}</strong> — {blog.author}{' '}
        <button onClick={toggle}>{expanded ? 'hide' : 'view'}</button>
      </div>

      {expanded && (
        <div style={{ marginTop: 6 }}>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}{' '}
            <button onClick={() => onLike(blog)}>like</button>
          </div>
          <div>
            {blog.user && blog.user.name
              ? `added by ${blog.user.name}`
              : 'added by unknown'}
          </div>
          {canDelete && (
            <div style={{ marginTop: 6 }}>
              <button
                onClick={() => onDelete(blog)}
                style={{ background: '#fee', borderColor: '#f88' }}
              >
                delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
