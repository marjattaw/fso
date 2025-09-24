const Blog = require('../models/blog')

const initialBlogs = [
  { title: 'HTML is easy', author: 'Matti', url: 'https://ex1', likes: 5 },
  { title: 'React patterns', author: 'Ada', url: 'https://ex2', likes: 7 }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}

const nonExistingId = async () => {
  const b = new Blog({ title: 'temp', url: 'x' })
  await b.save()
  await b.deleteOne()
  return b._id.toString()
}

module.exports = { initialBlogs, blogsInDb, nonExistingId }
