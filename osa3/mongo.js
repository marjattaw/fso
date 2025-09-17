// mongo.js — komentorivityökalu puhelinluetteloon (3.12)
// Käyttö:
//  - Listaa kaikki:    node mongo.js <password>
//  - Lisää yksi:       node mongo.js <password> "<name>" <number>

const mongoose = require('mongoose')

// *** VAIHDA OMAT ARVOT ***
const DB_USER = 'marsumarjatta'                 // DB user
const DB_HOST = 'cluster0.u4gt7yr.mongodb.net'  // host
const DB_NAME = 'phonebook'
                   // kannan nimi

// Parametrit: [node, mongo.js, password, name?, number?]
const [,, password, name, number] = process.argv

if (!password) {
  console.log('Usage:')
  console.log('  List all:  node mongo.js <password>')
  console.log('  Add one:   node mongo.js <password> "<name>" <number>')
  process.exit(1)
}

// Rakenna URI komentoriviltä annetulla salasanalla
const uri = `mongodb+srv://${DB_USER}:${encodeURIComponent(password)}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', true)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

async function listAll() {
  try {
    await mongoose.connect(uri)
    const persons = await Person.find({})
    console.log('phonebook:')
    persons.forEach(p => console.log(`${p.name} ${p.number}`))
  } catch (err) {
    console.error('Error listing persons:', err.message)
  } finally {
    await mongoose.connection.close()
  }
}

async function addOne(name, number) {
  if (!name || !number) {
    console.log('Error: both <name> and <number> are required to add a person.')
    console.log('Example: node mongo.js <password> "Ada Lovelace" 040-1234567')
    process.exit(1)
  }

  try {
    await mongoose.connect(uri)
    const person = new Person({ name, number })
    await person.save()
    console.log(`added ${name} number ${number} to phonebook`)
  } catch (err) {
    console.error('Error adding person:', err.message)
  } finally {
    await mongoose.connection.close()
  }
}

;(async () => {
  if (!name && !number) {
    await listAll()
  } else {
    await addOne(name, number)
  }
})()
