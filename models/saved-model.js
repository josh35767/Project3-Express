const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mySavedSchema = new Schema(
  {

    songId: {
      type: String
    },

    songTitle: {
      type: String
    },

    songArtist: String,

    artistId: String,

    lyricUrl: String,
  },
  {
    timestamps: true
  }
);

const SavedModel = mongoose.model('Saved', mySavedSchema);

module.exports = SavedModel;
