const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true, minLength: 6 },
  image: { type: String, required: true },
  places: { type: String, required: true }
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)