const logger = require('./logger')

const unknownEndpoint = (_req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, _req, res, next) => {
  logger.error(error.name, error.message)

  if (error.name === 'CastError')        return res.status(400).send({ error: 'malformatted id' })
  if (error.name === 'ValidationError')  return res.status(400).json({ error: error.message })
  if (error.name === 'MongoServerError' && error.message.includes('E11000')) {
    return res.status(400).json({ error: 'duplicate key' })
  }
  if (error.name === 'JsonWebTokenError') return res.status(401).json({ error: 'invalid token' })
  if (error.name === 'TokenExpiredError') return res.status(401).json({ error: 'token expired' })

  next(error)
}

module.exports = { unknownEndpoint, errorHandler }
