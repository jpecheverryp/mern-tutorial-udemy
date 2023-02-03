const express = require('express');

const placesRoutes = require('./routes/places-routes');

const app = express();

app.use(express.urlencoded({ extended: false }))

app.use('/api/places', placesRoutes)

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error)
  }
  res.status(error.code || 500) // Check if code was given as a parameter or default to 500
  res.json({ message: error.message || 'An Error has ocurred on the server'})
})

app.listen(5000)