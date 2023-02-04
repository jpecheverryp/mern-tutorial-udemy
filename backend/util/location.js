const { default: axios } = require("axios")

const HttpError = require('../models/http-error');

const API_KEY = 'AIzaSyCBMHwsyKY3fR2N8cj6b4FxbsqhD9zUKis' // Will reset and move to environment

const getCoordinatesForAddress = async (address) => {

  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  )
  const data = response.data

  if (!data || data.status === 'ZERO_RESULTS') {
    const error = new HttpError('Could not find location for specified address.', 422)
    throw error
  }

  const coordinates = data.results[0].geometry.location
  return coordinates
}

module.exports = getCoordinatesForAddress