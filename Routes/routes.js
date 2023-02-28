const Express = require('Express')
const userApi = Express.Router()
const {
  getUsers,
  createUser,
  getSpecificUser,
  deleteUser,
  updateUser
} = require('../Controller/controller')
userApi.route('/').post(createUser).get(getUsers)
userApi.route('/:id').get(getSpecificUser).put(updateUser).delete(deleteUser)
module.exports = userApi
