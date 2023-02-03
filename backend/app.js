const express = require('express');
const HttpError = require('./models/http-error');

const placesRoutes = require('./routes/places-routes');
const userRoutes = require('./routes/users-routes');

const app = express();

app.use(express.json())

app.use('/api/places', placesRoutes)
app.use('/api/users', userRoutes)

// If does not find route then
app.use((req, res, next) => {
  const error = new HttpError('Could not find this route', 404)
  return next(error)
})

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error)
  }
  res.status(error.code || 500) // Check if code was given as a parameter or default to 500
  res.json({ message: error.message || 'An Error has ocurred on the server'})
})

app.listen(5000)