const express = require('express');
const router  = express.Router();
const request = require('request');

/* GET home page. */
router.get('/api/find/:userInput', (req, res, next) => {
  let result;

  var propertiesObject = {
    q_lyrics: req.params.userInput,
    s_track_rating:'desc',
    quorum_factor:'1',
    f_lyrics_language:'en',
    format:'json',
    callback:'callback',
    page_size: '25',
    apikey: process.env.musixMatchApiKey
  };

  request.get({
    url: 'https://api.musixmatch.com/ws/1.1/track.search',
    qs: propertiesObject
  }, function(err, response, body) {
    console.log(response);
    res.json(body);
  });

});

router.post('/api/findtracks/', (req, res, next) => {
  let result;

  var propertiesObject = {
    q_artist: req.body.artist,
    q_track: req.body.track,
    s_track_rating:'desc',
    quorum_factor:'1',
    f_lyrics_language:'en',
    format:'json',
    callback:'callback',
    page_size: '25',
    apikey: process.env.musixMatchApiKey
  };

  request.get({
    url: 'https://api.musixmatch.com/ws/1.1/track.search',
    qs: propertiesObject
  }, function(err, response, body) {
    console.log(response);
    res.json(body);
  });

});

module.exports = router;
