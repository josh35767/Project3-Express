const mongoose = require('mongoose');
const SavedModel = require('./saved-model.js');

const Schema = mongoose.Schema;

const myUserSchema = new Schema(
  {

    username: {
      type: String,
      required: true
    },

    encryptedPassword: {
      type: String,
      required: true
    },

    favorites: [SavedModel.schema],

    recentSearches: [
      {
        typeOfSearch: String,
        lyricQuery: String,
        artistQuery: String,
        trackQuery: String
      }
    ]
  },
  {
    timestamps: true
  }
);

const UserModel = mongoose.model('User', myUserSchema);

module.exports = UserModel;
