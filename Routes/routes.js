/* eslint-disable no-unused-vars */
const Express = require("express");
const userApi = Express.Router();
const { checkId, checkMail, checkPassword } = require("../MiddleWares/validator");
const multer = require("multer");
const checkToken = require("../MiddleWares/checkToken");
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
  forgot,
  createUser,
  getSpecificUser,
  deleteUser,
  updateUser,
  logOut,
  GetReset,
  PostReset
} = require("../Controller/controller");
userApi
  .route("/")
  .post(upload.single("profileImage"), checkPassword, checkMail, createUser)
  .delete(checkPassword, checkMail, deleteUser)
  .get(checkToken, getSpecificUser);
userApi
  .route("/:id")
  .put(checkId, checkPassword, checkMail, updateUser);
userApi
  .route("/Forget_password")
  .get()
  .post(forgot);
userApi
  .route("/reset-password/:id/:token")
  .get(GetReset)
  .post(PostReset);

// .put(checkPassword, checkMail, updateUser)
// .get(getUsers)
//   .get(checkId, checkToken, getSpecificUser)
//   .delete(checkId, checkPassword, checkMail, deleteUser);
module.exports = userApi;
// POST GET PUT:: DELETE
