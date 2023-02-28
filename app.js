const Express = require('Express')
const db = require('./connectTodb/db')
const app = Express()
const morgan = require('morgan')
const userRoutes = require('./Routes/routes')
require('dotenv').config()
app.use(Express.json())
app.use(morgan('dev'))
app.use('/api/v1/user', userRoutes)
// if (process.env.NODE_ENV === 'development') {
// }
db.connect(process.env.uri).then(() => {
  app.listen(process.env.port || 3000, () => { console.log(`app listen at port ${process.env.port || 3000}`) })
}).catch((error) => {
  console.log(`there are problem ${error}`)
})
