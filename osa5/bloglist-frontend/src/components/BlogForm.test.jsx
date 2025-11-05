import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  it('calls onCreate with correct fields', async () => {
    const user = userEvent.setup()
    const onCreate = vi.fn()
    render(<BlogForm onCreate={onCreate} />)

    await user.type(screen.getByLabelText(/title/i), 'Hello')
    await user.type(screen.getByLabelText(/author/i), 'Me')
    await user.type(screen.getByLabelText(/url/i), 'http://example.com')
    await user.click(screen.getByRole('button', { name: /create/i }))

    expect(onCreate).toHaveBeenCalledTimes(1)
    expect(onCreate).toHaveBeenCalledWith({ title: 'Hello', author: 'Me', url: 'http://example.com' })
  })
})
