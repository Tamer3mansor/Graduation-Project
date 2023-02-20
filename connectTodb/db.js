const mongoose = require('mongoose')
require('dotenv').config()
const connect = (dbURI) => {
  return mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
}
module.exports = { connect }
