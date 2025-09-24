const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

// Alusta kanta aina samaan tilaan
beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('GET /api/blogs', () => {
  test('returns json and correct amount (4.8)', async () => {
    const res = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(res.body.length, helper.initialBlogs.length)
  })

  test('blog identifier field is named id (4.9)', async () => {
    const res = await api.get('/api/blogs')
    const one = res.body[0]
    assert.ok(one.id)          // on olemassa
    assert.strictEqual('_id' in one, false) // _id EI ole
  })
})

describe('POST /api/blogs', () => {
  test('creates a new blog (4.10)', async () => {
    const newBlog = {
      title: 'New post',
      author: 'Author',
      url: 'https://new',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert(titles.includes('New post'))
  })
})

describe('DELETE /api/blogs/:id', () => {
  test('removes one blog (4.13)', async () => {
    const start = await helper.blogsInDb()
    const toDelete = start[0]

    await api.delete(`/api/blogs/${toDelete.id}`).expect(204)

    const end = await helper.blogsInDb()
    assert.strictEqual(end.length, start.length - 1)

    const titles = end.map(b => b.title)
    assert(!titles.includes(toDelete.title))
  })
})

after(async () => {
  await mongoose.connection.close()
})
