const Express = require("Express");
const userApi = Express.Router();
const { checkId, checkMail, checkPassword } = require("../MiddleWares/validator");
const multer = require("multer");
const upload = multer({ dest: "upload/" }).single("demo_image");
const {
  getUsers,
  createUser,
  getSpecificUser,
  deleteUser,
  updateUser,
  // eslint-disable-next-line no-unused-vars
  logOut
} = require("../Controller/controller");
userApi.route("/")
  .post(upload, checkPassword, checkMail, createUser)
  .get(getUsers);
userApi.route("/:id")
  .get(checkId, getSpecificUser)
  .put(checkId, updateUser)
  .delete(checkId, deleteUser);
module.exports = userApi;
