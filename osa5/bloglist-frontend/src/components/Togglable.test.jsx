// src/components/Togglable.test.jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Togglable from './Togglable'

describe('<Togglable />', () => {
  it('is hidden by default and shows content after clicking button', async () => {
    const user = userEvent.setup()
    render(
      <Togglable buttonLabel="create new blog">
        <div>INNER-CONTENT</div>
      </Togglable>
    )

    // aluksi ei näy
    expect(screen.queryByText(/inner-content/i)).not.toBeInTheDocument()

    // avaa
    await user.click(screen.getByRole('button', { name: /create new blog/i }))
    expect(screen.getByText(/inner-content/i)).toBeInTheDocument()
  })

  it('hides after clicking cancel', async () => {
    const user = userEvent.setup()
    render(
      <Togglable buttonLabel="create new blog">
        <div>INNER</div>
      </Togglable>
    )

    await user.click(screen.getByRole('button', { name: /create new blog/i }))

    // wrapper jonka Togglable luo
    expect(screen.getByTestId('inner')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(screen.queryByTestId('inner')).not.toBeInTheDocument()
  })
})
