const Express = require('Express')
const link = Express.Router()
const { loginPost, signupPost } = require('../Controller/controller')
link.get('/login', loginPost)
link.post('/signup', signupPost)
link.put('/', (req, res) => { })
link.delete('/', (req, res) => { })
module.exports = link
