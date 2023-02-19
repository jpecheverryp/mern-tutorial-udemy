const fs = require('fs');

const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordinatesForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');
const mongoose = require('mongoose');


const getPlacesById = async (req, res, next) => {
  
  const placeId = req.params.pid

  let place
  try {
    place = await Place.findById(placeId)
  } catch (err) {
    return next(new HttpError('Something went wrong, could not find a place', 500))
  }
  
  if (!place) {
    return next(
      new HttpError('Could not find a place for the provided id.', 404)
    )
  }
  res.json({ place: place.toObject( { getters: true } ) })
}

const getPlacesByUserId = async (req, res, next) => {

  const userId = req.params.uid

  let places
  try {
    places = await Place.find({ creator: userId })
  } catch (err) {
    return next(new HttpError('Something went wrong, could not find any places', 500))
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError('Could not find any places for the provided user id.', 404)
    )
  }

  res.json({ places: places.map(place => place.toObject({ getters: true })) })
}

const createPlace = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs given, please check your data', 422))
  }

  const {title, description, address} = req.body
  let coordinates
  try {
    coordinates = await getCoordinatesForAddress(address)
  } catch (error) {
    return next(error) 
  }
  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator: req.userData.userId
  })

  let user;

  try {
    user = await User.findById(req.userData.userId)
  } catch (err) {
    return next( new HttpError('Creating place failed. Please try again.', 500) )
  }

  if (!user) {
    return next( new HttpError('Could not find user for provided id', 404) )
  }

  try {
    const sess = await mongoose.startSession()
    sess.startTransaction()
    await createdPlace.save({ session: sess })
    user.places.push(createdPlace)
    await user.save({session: sess})
    await sess.commitTransaction()
  } catch (err) {
    const error = new HttpError('Creating Place Failed, please try again', 500)
    return next(error)
  }
  
  res.status(201).json({place: createdPlace})
}

const updatePlace = async (req, res, next) => {

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs given, please check your data', 422))
  }
  
  const {title, description} = req.body
  const placeId = req.params.pid

  let updatedPlace
  try {
    updatedPlace = await Place.findById(placeId)
  } catch (err) {
    return next( new HttpError('Something went wrong , could not update place', 500) )
  }

  if (updatedPlace.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      'You are not allowed to edit this place',
      401
    )
    return next(error)
  }
  
  updatedPlace.title = title
  updatedPlace.description = description

  try {
    await updatedPlace.save()
  } catch (err) {
    return next( new HttpError('Something went wrong , could not update place', 500) )
  }

  res.status(200).json({place: updatedPlace.toObject({ getters: true})})
}

const deletePlace = async (req, res, next) => {

  const placeId = req.params.pid

  let placeToBeDeleted;
  try {
    placeToBeDeleted = await Place.findById(placeId).populate('creator')
  } catch (err) {
    return next( new HttpError('Something went wrong. Could not delete place'), 500 )
  }

  if (!placeToBeDeleted) {
    return next( new HttpError('Could not find place for this Id', 404) )
  }

  if (placeToBeDeleted.creator.id !== req.userData.userId) {
    const error = new HttpError(
      'You are not allowed to delete this place',
      401
    )
    return next(error)
  }

  const imagePath = placeToBeDeleted.image

  try {
    const sess = await mongoose.startSession()
    sess.startTransaction()
    await placeToBeDeleted.remove({ session: sess })
    placeToBeDeleted.creator.places.pull(placeToBeDeleted)
    await placeToBeDeleted.creator.save({ session: sess })
    await sess.commitTransaction()
  } catch (err) {
    return next( new HttpError('Something went wrong. Could not delete place'), 500 )
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  })

  res.status(200).json({message: 'Deleted place succesfully.'})
}

exports.getPlaceById = getPlacesById
exports.getPlacesByUserId = getPlacesByUserId
exports.createPlace = createPlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace