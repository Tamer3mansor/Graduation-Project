const userModel = require('../models/user')
const asyncHandler = require('express-async-handler')

const getUsers = asyncHandler(async (req, res) => {
  // pagination for return specific numbers
  const allUsers = await userModel.find({})
  res.status(200).send(allUsers)
})
const createUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const level = req.body.level || '000'
  const score = req.body.score || '000'
  const user = await userModel.create({ email, password, level, score })
  res.status(201).json({ data: user })
})
const getSpecificUser = asyncHandler(async (req, res) => {
  const { id } = req.params
  const user = await userModel.findById(id)
  if (user) res.status(200).json({ user })
  else res.status(400).json({ msg: 'No user with this id' })
})
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params
  const user = await userModel.findByIdAndDelete(id)
  if (user) res.status(200).json({ user })
  else res.status(400).send({ msg: 'No Category with this id' })
})
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params
  const email = req.body.email
  const password = req.body.password
  const user = await userModel.findByIdAndUpdate(
    { _id: id },
    { email, password },
    { new: true }
  )
  if (user) res.status(200).json({ user })
  else res.status(400).send({ msg: 'No Category with this id' })
})

module.exports = {
  getUsers,
  createUser,
  getSpecificUser,
  deleteUser,
  updateUser
}
