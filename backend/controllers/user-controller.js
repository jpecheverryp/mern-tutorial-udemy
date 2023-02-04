const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');

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

const signup = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs given, please check your data', 422))
  }

  const {name, email, password} = req.body

  const hasUser = DUMMY_USERS.find(u => u.email === email)
  if (hasUser) {
    return next(new HttpError('Could not create user, email already registered', 422))
  }

  const createdUser = {
    id: uuidv4(),
    name, 
    email,
    password
  }
  DUMMY_USERS.push(createdUser)
  res.status(201).json({user: createdUser})
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