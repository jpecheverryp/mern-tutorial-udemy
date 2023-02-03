const express = require('express');

// Controllers
const { getUsers, signup, login } = require('../controllers/user-controller');

const router = express.Router()

router.get('/', getUsers)

router.post('/signup', signup)

router.post('/login', login)

module.exports = router