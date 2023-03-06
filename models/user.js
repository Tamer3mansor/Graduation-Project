/* eslint-disable new-cap */
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");
const apiError = require("../utils/apiError");
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: [true, "please enter Name"],
      unique: true,
      lowercase: true,
      validate: [isEmail, "please enter a valid email"]
    },
    password: {
      type: String,
      require: [true, "please enter a password"],
      minlength: [6, "password must be more than 6 char"]
    },
    level: {
      type: String,
      require: [true]
    },
    score: Number,
    image: {
      data: Buffer,
      contentType: String
    }
  },

  { timestamps: true }
);
// bcrypt passwords
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
// auth that user is loged
userSchema.statics.loginAuth = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const passwordAuth = await bcrypt.compare(password, user.password);
    if (passwordAuth) {
      return user;
    } else {
      throw (new apiError(("Incorrect password"), 400));
    }
  } else {
    throw (new apiError(("Incorrect Email"), 400));
  }
};
const userModel = mongoose.model("userModel", userSchema);

module.exports = userModel;
