// e2e/tests/blog.spec.js
import { test, expect } from '@playwright/test'

const API = 'http://localhost:3003'

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    // nollaa kanta (kurssin backendissä on tämä testireitti)
    await request.post(`${API}/api/testing/reset`)

    // luo käyttäjä
    await request.post(`${API}/api/users`, {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen',
      },
    })

    await page.goto('/') // vastaa baseURL:ia (5173)
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /log in to application/i })).toBeVisible()
    await expect(page.getByLabel(/username/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
  })

  test.describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByLabel(/username/i).fill('mluukkai')
      await page.getByLabel(/password/i).fill('salainen')
      await page.getByRole('button', { name: /login/i }).click()

      await expect(page.getByText(/logged in/i)).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel(/username/i).fill('mluukkai')
      await page.getByLabel(/password/i).fill('väärä')
      await page.getByRole('button', { name: /login/i }).click()

      // muokkaa valitsinta oman Notification-komponenttisi mukaan
      await expect(page.getByText(/wrong username|password/i)).toBeVisible()
    })
  })

  test.describe('When logged in', () => {
    test.beforeEach(async ({ page, request }) => {
      // nopea kirjautuminen API:n kautta -> localStorageen
      const res = await request.post(`${API}/api/login`, {
        data: { username: 'mluukkai', password: 'salainen' },
      })
      const user = await res.json()
      await page.addInitScript((u) => {
        window.localStorage.setItem('loggedBloglistUser', JSON.stringify(u))
      }, user)
      await page.goto('/') // reload että app lukee tokenin
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: /create new blog/i }).click()
      await page.getByLabel(/title/i).fill('Playwright Blog')
      await page.getByLabel(/author/i).fill('PW Author')
      await page.getByLabel(/url/i).fill('https://pw.example')
      await page.getByRole('button', { name: /create/i }).click()

      await expect(page.getByText(/playwright blog/i)).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      // luo blog
      await page.getByRole('button', { name: /create new blog/i }).click()
      await page.getByLabel(/title/i).fill('Likable')
      await page.getByLabel(/author/i).fill('Someone')
      await page.getByLabel(/url/i).fill('https://like.example')
      await page.getByRole('button', { name: /create/i }).click()

      // avaa ja like
      const card = page.getByText(/Likable/).locator('..').locator('..') // ota kortin root
      await card.getByRole('button', { name: /view/i }).click()
      const likesRow = card.getByText(/likes/i).locator('..')
      await card.getByRole('button', { name: /like/i }).click()
      await expect(likesRow).toContainText(/1/)
    })

    test('the user who added a blog can delete it', async ({ page }) => {
      await page.getByRole('button', { name: /create new blog/i }).click()
      await page.getByLabel(/title/i).fill('To be deleted')
      await page.getByLabel(/author/i).fill('Del User')
      await page.getByLabel(/url/i).fill('https://del.example')
      await page.getByRole('button', { name: /create/i }).click()

      const card = page.getByText(/to be deleted/i).locator('..').locator('..')
      await card.getByRole('button', { name: /view/i }).click()

      // jos käytät window.confirmia, Playwright hyväksyy sen automaattisesti
      page.on('dialog', (d) => d.accept())
      await card.getByRole('button', { name: /delete/i }).click()

      await expect(page.queryByText?.(/to be deleted/i) ?? page.getByText(/to be deleted/i)).not.toBeVisible()
    })

    test('only the adder sees delete button', async ({ page, request, context }) => {
      // luo blogin käyttäjä A
      await page.getByRole('button', { name: /create new blog/i }).click()
      await page.getByLabel(/title/i).fill('Owner Only')
      await page.getByLabel(/author/i).fill('A')
      await page.getByLabel(/url/i).fill('https://owner.example')
      await page.getByRole('button', { name: /create/i }).click()

      // kirjaudu ulos ja sisään toisella käyttäjällä
      await page.getByRole('button', { name: /logout/i }).click()
      await request.post(`${API}/api/users`, {
        data: { name: 'Other', username: 'other', password: 'secret' },
      })
      const res = await request.post(`${API}/api/login`, {
        data: { username: 'other', password: 'secret' },
      })
      const other = await res.json()
      await context.clearCookies()
      await page.addInitScript((u) => {
        window.localStorage.setItem('loggedBloglistUser', JSON.stringify(u))
      }, other)
      await page.goto('/')

      // avaa kortti
      const card = page.getByText(/owner only/i).locator('..').locator('..')
      await card.getByRole('button', { name: /view/i }).click()
      await expect(card.getByRole('button', { name: /delete/i })).toBeHidden()
    })

    test('blogs are sorted by likes (desc)', async ({ page }) => {
      // tee 3 blogia
      const make = async (title, likes = 0) => {
        await page.getByRole('button', { name: /create new blog/i }).click()
        await page.getByLabel(/title/i).fill(title)
        await page.getByLabel(/author/i).fill('Sorter')
        await page.getByLabel(/url/i).fill('https://sort.example')
        await page.getByRole('button', { name: /create/i }).click()
        const card = page.getByText(new RegExp(title, 'i')).locator('..').locator('..')
        await card.getByRole('button', { name: /view/i }).click()
        for (let i = 0; i < likes; i++) {
          await card.getByRole('button', { name: /like/i }).click()
        }
      }
      await make('B1', 1)
      await make('B2', 3)
      await make('B3', 2)

      // kerää kortit ja tarkista järjestys: B2, B3, B1
      const cards = await page.locator('.blog').allInnerTexts()
      const titlesInOrder = cards.map(t => t.split('\n')[0].trim().toLowerCase())
      expect(titlesInOrder[0]).toContain('b2')
      expect(titlesInOrder[1]).toContain('b3')
      expect(titlesInOrder[2]).toContain('b1')
    })
  })
})
