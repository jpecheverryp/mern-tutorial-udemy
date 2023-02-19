require('dotenv').config();

const fs = require('fs');
const path = require('path');

const express = require('express');
const mongoose = require('mongoose');

const HttpError = require('./models/http-error');

const placesRoutes = require('./routes/places-routes');
const userRoutes = require('./routes/users-routes');

const MONGO_URI = process.env.MONGO_URI

const app = express();

app.use(express.json())

app.use('/uploads/images', express.static(path.join('uploads', 'images')))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  next()
})

app.use('/api/places', placesRoutes)
app.use('/api/users', userRoutes)

// If does not find route then
app.use((req, res, next) => {
  const error = new HttpError('Could not find this route', 404)
  return next(error)
})

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    })
  }
  if (res.headerSent) {
    return next(error)
  }
  res.status(error.code || 500) // Check if code was given as a parameter or default to 500
  res.json({ message: error.message || 'An Error has ocurred on the server'})
})

mongoose
  .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.qa4yxkb.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log('Server running in http://localhost:5000');
    })
  })
  .catch(err => 
    console.error(err)
  )
