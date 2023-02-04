const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

let DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous skyscrappers in the world.',
    location: {
      lat: 40.7484474,
      lng: -73.9871516
    },
    address: '20 W 34th St, New York, NY 10001',
    creator: 'u1'
  },
  {
    id: 'p2',
    title: 'Wall Street',
    description: 'One of the most famous skyscrappers in the world.',
    location: {
      lat: 40.7484474,
      lng: -73.9871516
    },
    address: '20 W 34th St, New York, NY 10001',
    creator: 'u1'
  },
]

const getPlacesById = (req, res, next) => {
  
  const placeId = req.params.pid
  const place = DUMMY_PLACES.find(place => place.id === placeId)

  if (!place) {
    return next(
      new HttpError('Could not find a place for the provided id.', 404)
    )
  }
  res.json({place})
}

const getPlacesByUserId = (req, res, next) => {

  const userId = req.params.uid
  const places = DUMMY_PLACES.filter(place => place.creator === userId)
  if (!places || places.length === 0) {
    return next(
      new HttpError('Could not find any places for the provided user id.', 404)
    )
  }

  res.json({places})
}

const createPlace = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs given, please check your data', 422))
  }

  const {title, description, coordinates, address, creator} = req.body
  const createdPlace = {
    id: uuidv4(),
    title, 
    description,
    location: coordinates,
    address,
    creator
  }

  DUMMY_PLACES.push(createdPlace)
  res.status(201).json({place: createdPlace})
}

const updatePlace = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs given, please check your data', 422))
  }
  
  const {title, description} = req.body
  const placeId = req.params.pid

  const updatedPlace = { ...DUMMY_PLACES.find(place => place.id === placeId) }
  const placeIndex = DUMMY_PLACES.findIndex(place => place.id === placeId)
  updatedPlace.title = title
  updatedPlace.description = description

  DUMMY_PLACES[placeIndex] = updatedPlace

  res.status(200).json({place: updatedPlace})
}

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid
  DUMMY_PLACES = DUMMY_PLACES.filter(place => place.id !== placeId)
  res.status(200).json({message: 'Deleted place succesfully.'})
}

exports.getPlaceById = getPlacesById
exports.getPlacesByUserId = getPlacesByUserId
exports.createPlace = createPlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace