const userModel = require("../models/user");
const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");

const getUsers = asyncHandler(async (req, res, next) => {
  // pagination for return specific numbers
  const allUsers = await userModel.find({});
  if (allUsers) { res.status(200).send(allUsers); } else { return next(new apiError("Not found", 400)); };
});
const createUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const level = req.body.level || "000";
  const score = req.body.score || "000";
  const user = await userModel.create({ email, password, level, score });
  console.log(`this is error${user}`);
  // eslint-disable-next-line new-cap
  if (user) res.status(201).json({ data: user }); else return next(new apiError("rebate username"));
});
const getSpecificUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.findById(id);
  if (user) res.status(200).json({ user });
  else {
    next(new apiError("No User Found with this id"), 400);
  }
});
const deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.findByIdAndDelete(id);
  if (user) res.status(200).json({ user });
  else {
    next(new apiError("No User Found with this id"), 400);
  }
});
const updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const email = req.body.email;
  const password = req.body.password;
  const level = req.body.level || "000";
  const score = req.body.score || 0;
  const user = await userModel.findByIdAndUpdate(
    { _id: id },
    { email, password, level, score },
    { new: true }
  );
  if (user) res.status(200).json({ user });
  else {
    next(new apiError("No User Found with this id"), 400);
  }
});

module.exports = {
  getUsers,
  createUser,
  getSpecificUser,
  deleteUser,
  updateUser
};
