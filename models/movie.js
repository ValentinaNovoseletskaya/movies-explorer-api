const mongoose = require('mongoose');
const validator = require('validator');
const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: [true, 'Поле "страна" должно быть заполнено'],
    },
    director: {
      type: String,
      required: [true, 'Поле "директор" должно быть заполнено'],
    },
    duration: {
      type: Number,
      required: [true, 'Поле "длительность" должно быть заполнено'],
    },
    year: {
      type: String,
      required: [true, 'Поле "год" должно быть заполнено'],
    },
    description: {
      type: String,
      required: [true, 'Поле "описание" должно быть заполнено'],
    },
    image: {
      type: String,
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректный URL',
      },
      required: [true, 'Поле "ссылка на постер" должно быть заполнено'],
    },
    trailerLink: {type: String,
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректный URL',
      },
      required: [true, 'Поле "ссылка на трейлер" должно быть заполнено'],
    },
    thumbnail: {type: String,
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректный URL',
      },
      required: [true, 'Поле "ссылка на миниатюру" должно быть заполнено'],
    },
    owner: {
      type: String,
      required: [true, 'Поле "ID пользователя" должно быть заполнено'],
    },
    movieId: {
      type: Number,
      required: [true, 'Поле "ID фильма" должно быть заполнено'],
    },
    nameRU: {
      type: String,
      required: [true, 'Поле "название" должно быть заполнено'],
    },
    nameEN: {
      type: String,
      required: [true, 'Поле "название" должно быть заполнено'],
    },
  },
  //{ versionKey: false },
);

module.exports = mongoose.model('movie', movieSchema);