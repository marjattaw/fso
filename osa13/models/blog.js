const { DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

const currentYear = new Date().getFullYear()

const Blog = sequelize.define('blog', {
  author: {
    type: DataTypes.TEXT,
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  year: {
    type: DataTypes.INTEGER,
    validate: {
      min: {
        args: 1991,
        msg: 'Year must be at least 1991'
      },
      max: {
        args: currentYear,
        msg: `Year cannot be greater than ${currentYear}`
      }
    }
  }
}, {
  underscored: true,
  timestamps: true        // created_at, updated_at
})

module.exports = Blog
