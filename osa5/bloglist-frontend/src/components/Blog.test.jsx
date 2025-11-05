import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  id: '1',
  title: 'Testing Blog',
  author: 'Tester',
  url: 'http://example.com',
  likes: 5,
  user: { id: 'u1', name: 'Testy', username: 'testy' },
}

const currentUser = { name: 'Testy', username: 'testy', id: 'u1' }

describe('<Blog />', () => {
  it('renders title and author by default, but not url/likes', () => {
    render(
      <Blog
        blog={blog}
        currentUser={currentUser}
        onLike={() => {}}
        onDelete={() => {}}
      />
    )

    // näkyvät heti
    expect(screen.getByText(/testing blog/i)).toBeInTheDocument()
    expect(screen.getByText(/tester/i)).toBeInTheDocument()

    // eivät näy ennen "view"
    expect(screen.queryByText(/http:\/\/example\.com/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/likes/i)).not.toBeInTheDocument()
  })

  it('shows url and likes after clicking view', async () => {
    const user = userEvent.setup()
    render(
      <Blog
        blog={blog}
        currentUser={currentUser}
        onLike={() => {}}
        onDelete={() => {}}
      />
    )

    await user.click(screen.getByRole('button', { name: /view/i }))

    // url näkyy
    expect(screen.getByText(/http:\/\/example\.com/i)).toBeInTheDocument()

    // sama div sisältää tekstin "likes", numeron ja napin -> tarkista koko rivin sisältö
    const likesRowDiv = screen.getByText(/likes/i).closest('div')
    expect(likesRowDiv).toBeInTheDocument()
    expect(likesRowDiv).toHaveTextContent(/likes\s*5/i)
  })

  it('calls onLike twice if like clicked twice', async () => {
    const user = userEvent.setup()
    const onLike = vi.fn()

    render(
      <Blog
        blog={blog}
        currentUser={currentUser}
        onLike={onLike}
        onDelete={() => {}}
      />
    )

    await user.click(screen.getByRole('button', { name: /view/i }))
    await user.click(screen.getByRole('button', { name: /like/i }))
    await user.click(screen.getByRole('button', { name: /like/i }))

    expect(onLike).toHaveBeenCalledTimes(2)
  })
})
