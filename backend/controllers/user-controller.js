const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
  let users
  try {
    users = await User.find({}, '-password')
  } catch (err) {
    return next( new HttpError('Fetching users failed. Please try again later', 500) )
  }
  res.json({users: users.map(user => user.toObject({getters: true}))})
}

const signup = async (req, res, next) => {
  console.log('User go to signup route')
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs given, please check your data', 422))
  }

  const {name, email, password} = req.body

  let existingUser
  try {
    existingUser = await User.findOne({ email: email })
  } catch (err) {
    return next( new HttpError('Signing Up Failed. Please try again later.', 500) )
  }

  if (existingUser) {
    return next( new HttpError('Email already registered', 422) )
  }

  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(password, 12)
  } catch (err) {
    const error = new HttpError('Could not create user, please try again', 500)
    return next(error)
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    places: [],
    image: req.file.path
  })

  try {
    await createdUser.save()
  } catch (err) {
    return next( new HttpError('Signing up failed. Please try again later', 500) )
  }

  let token
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    )
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later',
      500
    )
    return next(error)
  }

  res.status(201).json({
    userId: createdUser.id, 
    email: createdUser.email, 
    token 
  })
}

const login = async (req, res, next) => {
  const {email, password} = req.body

  let user
  try {
    user = await User.findOne({ email: email })
  } catch (err) {
    return next( new HttpError('Log in Failed. Please try again later.', 500) )
  }

  if (!user) {
    return next( new HttpError('Invalid e-mail. Please try again', 403) )
  }

  let isValidPassword = false
  try {
    isValidPassword = await bcrypt.compare(password, user.password)
  } catch (err) {
    const error = new HttpError(
      'Could not log in, please check your credentials and try again', 
      500
    )
    return next(error)
  }

  if (!isValidPassword) {
    return next( new HttpError('Invalid password. Please try again', 403) )
  }

  let token
  try {
    token = jwt.sign(
      { userId: user.id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    )
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later',
      500
    )
    return next(error)
  }

  res.json({
    userId: user.id,
    email: user.email,
    token: token
  })
}

exports.getUsers = getUsers
exports.signup = signup
exports.login = login