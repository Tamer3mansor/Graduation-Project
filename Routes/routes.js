const Express = require("Express");
const userApi = Express.Router();
const { checkId, checkMail, checkPassword } = require("../MiddleWares/validator");
const {
  getUsers,
  createUser,
  getSpecificUser,
  deleteUser,
  updateUser
} = require("../Controller/controller");
userApi.route("/")
  .post(checkPassword, checkMail, createUser)
  .get(getUsers);
userApi.route("/:id")
  .get(checkId, getSpecificUser)
  .put(checkId, updateUser)
  .delete(checkId, deleteUser);
module.exports = userApi;
