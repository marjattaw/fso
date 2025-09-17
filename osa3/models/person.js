const mongoose = require('mongoose')

mongoose.set('strictQuery', true)

const personSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  number: { type: String, required: true, trim: true },
})

personSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    return ret
  }
})

module.exports = mongoose.model('Person', personSchema)
