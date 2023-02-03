const express = require('express');

//Controllers
const { getPlaceById, getPlaceByUserId } = require('../controllers/places-controllers');

const router = express.Router();

router.get('/:pid', getPlaceById)

router.get('/user/:uid', getPlaceByUserId)

module.exports = router