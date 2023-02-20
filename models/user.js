const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { isEmail } = require('validator')
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: [true, 'please enter Name'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'please enter a valid email']
  },
  password: {
    type: String,
    require: [true, 'please enter a password'],
    minlength: [6, 'password must be more than 6 char']
  },
  Level: {
    type: String,
    require: [true]
  }
})
// bcrypt passwords
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt)
  next()
})
