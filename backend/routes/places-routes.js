const express = require('express');
const { check } = require('express-validator');

//Controllers
const { getPlaceById, getPlacesByUserId, createPlace, updatePlace, deletePlace } = require('../controllers/places-controllers');

const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/:pid', getPlaceById)

router.get('/user/:uid', getPlacesByUserId)

// Public routes above

router.use(checkAuth)

// Private routes below

router.post(
  '/', 
  fileUpload.single('image'),
  [
    check('title')
      .not()
      .isEmpty(),
    check('description')
      .isLength({ min: 5 }),
    check('address')
      .not()
      .isEmpty()
  ], 
  createPlace
)

router.patch('/:pid', [
  check('title')
    .not()
    .isEmpty(),
    check('description')
      .isLength({ min: 5 }),
], updatePlace)

router.delete('/:pid', deletePlace)

module.exports = router