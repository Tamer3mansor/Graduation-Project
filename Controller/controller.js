const userModel = require("../models/user");
const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");
const jwt = require("jsonwebtoken");
const log = require("../logging/controller");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../utils/sendEmail");
const createToken = (id) => {
  return jwt.sign({ id }, process.env.secret, { expiresIn: 4 * 24 * 60 * 60 });
};
const getUsers = asyncHandler(async (req, res, next) => {
  // pagination for return specific numbers
  const allUsers = await userModel.find({});
  if (allUsers) {
    log.info("Accepted getUsers Operation");
    res.status(200).send(allUsers);
  } else {
    log.error("Error : Not Found Error");
    return next(new apiError("Not found", 400));
  }
});
const createUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const level = req.body.level || "000";
  const score = req.body.score || "000";
  const image = req.file.path;
  try {
    const user = await userModel.create({
      email,
      password,
      level,
      score,
      image
    });
    const token = createToken(user._id);
    if (user) {
      log.info("Success Create user operation");
      res.cookie("userjwt", token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000
      });
      res.status(201).json({ data: user });
    }
  } catch (error) {
    let message = "";
    if (error.code === 11000) {
      message += `This email already in dataBase<${error.name}>`;
    } else message += `Error while trying to create try agin <${error.name}>`;
    // eslint-disable-next-line new-cap
    log.error({ message });
    // eslint-disable-next-line new-cap
    next(new apiError(message), error.code);
  }
  // eslint-disable-next-line new-cap
});
const getSpecificUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.loginAuth(email, password);
  console.log(user, user._id);
  if (user) {
    const token = createToken(email, password);
    res.cookie("userjwt", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000
    });
    res.status(200).json({ user });
    log.info("Success get user operation");
  } else {
    log.error("No User Found with this email");
    next(new apiError("No User Found with this email"), 400);
  }
});
const deleteUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.loginAuth(email, password);
  if (user) {
    const id = user._id;
    const deleted = await userModel.findByIdAndDelete(id);
    if (deleted) res.status(200).json({ deleted });
    log.info("Success delete operation");
  } else {
    next(new apiError("No User Found with this id"), 400);
    log.error("No User Found with this email");
  }
});
const updateUser = asyncHandler(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const level = req.body.level || "000";
  const score = req.body.score || 0;
  const id = req.params.id;
  const salt = await bcrypt.genSalt();
  const bypassword = await bcrypt.hash(password, salt);
  /* stopped until front end  */
  // const user = await userModel.loginAuth(email, password);
  const user = true;
  if (user) {
    try {
      const updated = await userModel.findByIdAndUpdate(
        { _id: id },
        { email, password: bypassword, level, score },
        { new: true }
      );
      if (updated) {
        res.status(200).json({ updated });
        log.info("Success update");
      }
    } catch (error) {
      let message = "";
      if (error.code === 11000) {
        message += `This email already in dataBase<${error.name}>`;
      } else message += `Error while trying to create try agin <${error.name}>`;
      log.error({ message });
      // eslint-disable-next-line new-cap
      next(new apiError(message), error.code);
    }
  } else {
    // eslint-disable-next-line new-cap
    next(new apiError("No User Found with this id"), 400);
    log.error("No User Found with this id/email");
  }
});
const logOut = (req, res) => {
  res.cookie("userjwt", " ", { maxAge: 1 });
  res.redirect("/");
};
const forgot = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.loginAuth(email, "forget");
  if (user) {
    const secret = process.env.secret + user.password;
    const payload = {
      email,
      id: user.id
    };
    const token = jwt.sign(payload, secret, { expiresIn: "10m" });
    const link = `${process.env.BASE_URL}/reset-password/${user.id}/${token}`;
    // console.log(sendEmail);
    const send = sendEmail(email, link);
    console.log(send);
    res.send(link);
  }
});
const GetReset = asyncHandler(async (req, res, next) => {
  const { id, token } = req.params;
  const user = await userModel.findOne({ _id: id });
  if (!user) {
    log.error("No User Found with this email");
  } else {
    const secret = process.env.secret + user.password;
    try {
      const peloyd = jwt.verify(token, secret);
      if (peloyd)log.info("verified password");
      res.send("go to reset");
    } catch (error) {
      console.log(error);
      log.error("Not verified token");
    }
  }
});
const PostReset = asyncHandler(async (req, res, next) => {
  let { password, confirm } = req.body;
  password = password.toString();
  confirm = confirm.toString();
  // console.log(req.body);
  const { id, token } = req.params;
  const user = await userModel.findOne({ _id: id });
  if (!user) {
    log.error("No User Found with this email");
  } else {
    const secret = process.env.secret + user.password;
    try {
      const peloyd = jwt.verify(token, secret);
      if (password === confirm) {
        const salt = await bcrypt.genSalt();
        const bypassword = await bcrypt.hash(password, salt);
        user.password = bypassword;
        res.send(user);
      } else res.send("Password NOT equal");
    } catch (error) {
      console.log(error);
      log.error("Not verified token");
    }
  }
});
module.exports = {
  getUsers,
  createUser,
  getSpecificUser,
  deleteUser,
  updateUser,
  logOut,
  forgot,
  GetReset,
  PostReset
};
