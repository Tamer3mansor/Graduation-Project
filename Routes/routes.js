const Express = require("Express");
const userApi = Express.Router();
const { checkId, checkMail, checkPassword } = require("../MiddleWares/validator");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });
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
  .post(upload.single("profileImage"), checkPassword, checkMail, createUser)
  .get(getUsers);
userApi.route("/:id")
  .get(checkId, getSpecificUser)
  .put(checkId, updateUser)
  .delete(checkId, deleteUser);
module.exports = userApi;
