const userSchema = require('../models/user')
const signupPost = async (req, res) => {
  const { email, password } = req.params
  console.log(req)
  try {
    await userSchema.create({ email, password })
    res.status(201).json({ user: email })
  } catch (error) {
    res.status(404).json({ error })
  }
}
const loginPost = async (req, res) => {
  console.log(req.params)
  const { email } = req.params
  try {
    await userSchema.findOne({ email })
  } catch (error) {
    res.status(404).json({ error })
  }
}

module.exports = {
  signupPost, loginPost
}
