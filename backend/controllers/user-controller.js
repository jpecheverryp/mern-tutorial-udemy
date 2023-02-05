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

const getUsers = (req, res, neaxt) => {
  return res.json({ users: DUMMY_USERS })
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
    image: 'https://randomuser.me/api/portraits/men/75.jpg',
    password,
    places
  })
  
  try {
    await createdUser.save()
  } catch (err) {
    return next( new HttpError('Signing up failed. Please try again later', 500) )
  }

  res.status(201).json({user: createdUser.toObject({ getters: true })})
}

const login = (req, res, next) => {
  const {email, password} = req.body

  const identifiedUser = DUMMY_USERS.find(u => u.email === email)
  if (!identifiedUser) {
    return next(new HttpError('Could not identify user.', 401))
  }
  if (identifiedUser.password !== password) {
    return next(new HttpError('Incorrect Password', 403))
  }

  res.json({message: 'Logged In!!'})
}

exports.getUsers = getUsers
exports.signup = signup
exports.login = login