import { describe, expect, it, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

// Mockkaa koko services/blogs -moduuli:
//  - default: { getAll: fn() } (palauttaa tyhjän listan)
//  - setToken: fn()
vi.mock('./services/blogs', () => ({
  default: {
    getAll: vi.fn().mockResolvedValue([]),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
  setToken: vi.fn(),
}))

// Mockkaa myös login-service, jos haluat myöhemmin testata kirjautumista
vi.mock('./services/login', () => ({
  default: { login: vi.fn() },
}))

beforeEach(() => {
  // varmista ettei localStoragessa ole käyttäjää
  window.localStorage.clear()
})

describe('<App />', () => {
  it('näyttää login-lomakkeen kun käyttäjä ei ole kirjautunut', async () => {
    render(<App />)
    expect(await screen.findByRole('heading', { name: /log in to application/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })
})
