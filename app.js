const Express = require('Express')
const db = require('./connectTodb/db')
const app = Express()
require('dotenv').config()
db.connect(process.env.uri).then(() => {
  app.listen(process.env.port || 3000, () => { console.log(`app listen at port ${process.env.port || 3000}`) })
}).catch((error) => {
  console.log(`there are problem ${error}`)
})
