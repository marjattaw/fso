const { Sequelize } = require('sequelize')

const Blog = require('../models/blog')
const User = require('../models/user')
const ReadingList = require('../models/reading_list')

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    dialect: 'postgres'
  }
)

// Suorat relaatiot
User.hasMany(Blog)
Blog.belongsTo(User)

// Many-to-many: käyttäjät <-> blogit readinglistin kautta
User.belongsToMany(Blog, { through: ReadingList })
Blog.belongsToMany(User, { through: ReadingList })

module.exports = {
  sequelize,
  Blog,
  User,
  ReadingList
}
