const info  = (...p) => { if (process.env.NODE_ENV !== 'test') console.log(...p) }
const error = (...p) => { if (process.env.NODE_ENV !== 'test') console.error(...p) }
module.exports = { info, error }
