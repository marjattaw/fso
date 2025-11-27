require('dotenv').config()
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(
  process.env.PGDATABASE,   // tietokannan nimi
  process.env.PGUSER,       // käyttäjä
  process.env.PGPASSWORD,   // salasana
  {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    dialect: 'postgres'
  }
)

const main = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    await sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()
