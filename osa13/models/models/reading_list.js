const { DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

const ReadingList = sequelize.define('reading_list', {
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: false
})

module.exports = ReadingList
