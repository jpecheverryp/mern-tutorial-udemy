const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'John Smith',
    email: 'test@test.com',
    password: 'testers'
  },
]

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
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs given, please check your data', 422))
  }

  const {name, email, password, places} = req.body

  let existingUser
  try {
    existingUser = await User.findOne({ email: email })
  } catch (err) {
    return next( new HttpError('Signing Up Failed. Please try again later.', 500) )
  }

  if (existingUser) {
    return next( new HttpError('Email already registered', 422) )
  }

  const createdUser = new User({
    name,
    email,
    password,
    places,
    image: 'https://randomuser.me/api/portraits/men/75.jpg'
  })

  try {
    await createdUser.save()
  } catch (err) {
    return next( new HttpError('Signing up failed. Please try again later', 500) )
  }

  res.status(201).json({user: createdUser.toObject({ getters: true })})
}

const login = async (req, res, next) => {
  const {email, password} = req.body

  let user
  try {
    user = await User.findOne({ email: email })
  } catch (err) {
    return next( new HttpError('Log in Failed. Please try again later.', 500) )
  }

  if (!user || user.password !== password) {
    return next( new HttpError('Invalid credentials. Please try again', 401) )
  }

  res.json({message: 'Logged In!!'})
}

exports.getUsers = getUsers
exports.signup = signup
exports.login = login