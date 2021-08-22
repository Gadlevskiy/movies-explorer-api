const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: function (v) {
      const regExp = /^(?:http(s)?:\/\/)?(w{3}\.)?[-a-z0-9._#]{1,}\.[-a-z0-9]{0,}\/?[a-z0-9-._~:/?#[\]@!$&'()*+,;=]{0,}#?$/gi;
      return regExp.test(v);
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: function (v) {
      const regExp = /^(?:http(s)?:\/\/)?(w{3}\.)?[-a-z0-9._#]{1,}\.[-a-z0-9]{0,}\/?[a-z0-9-._~:/?#[\]@!$&'()*+,;=]{0,}#?$/gi;
      return regExp.test(v);
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: function (v) {
      const regExp = /^(?:http(s)?:\/\/)?(w{3}\.)?[-a-z0-9._#]{1,}\.[-a-z0-9]{0,}\/?[a-z0-9-._~:/?#[\]@!$&'()*+,;=]{0,}#?$/gi;
      return regExp.test(v);
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: String,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
