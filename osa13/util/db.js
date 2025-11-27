const { Sequelize } = require('sequelize')
const Blog = require('../models/blog')
const User = require('../models/user')

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

// Relaatiot:
User.hasMany(Blog)
Blog.belongsTo(User)

module.exports = {
  sequelize,
  Blog,
  User
}
