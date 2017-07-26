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
    res.json(body);
  });

});

//Get top 10 tracks
router.get('/api/top-tracks', (req, res, next) => {
  let result;

  var propertiesObject = {
    format:'json',
    page_size: '9',
    country: 'us',
    apikey: process.env.musixMatchApiKey
  };

  request.get({
    url: 'https://api.musixmatch.com/ws/1.1/chart.tracks.get',
    qs: propertiesObject
  }, function(err, response, body) {
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
    res.json(body);
  });

});

router.post('/api/save-song', (req, res, next) => {
  if(!req.user) {
    res.status(401).json({message: "You must be logged in to do this."});
    return;
  }

  songExists = false;
  req.user.favorites.forEach((oneSong)=> {
    if(oneSong.songId.toString() === req.body.songId.toString()) {
      console.log("Blah");
      songExists = true;
      return;
    }
  });

  if(songExists) {
    res.status(400).json({ message: "Song already saved"});
    return;
  }

  const newSong = {
    songId: req.body.songId,
    songTitle: req.body.songTitle,
    songArtist: req.body.songArtist,
    artistId: req.body.artistId,
    lyricUrl: req.body.lyricUrl
  };
  req.user.favorites.push(newSong);

  req.user.save((err, updatedUser) => {
    if (err) {
      res.status(400).json(err);
      return;
    }

    req.user.encryptedPassword = undefined;
    res.status(200).json(req.user);
  });
});

//Remove song
router.post('/api/remove-song', (req, res, next) => {
  if(!req.user) {
    res.status(401).json({message: "You must be logged in to do this."});
    return;
  }


  songExists = false;
  req.user.favorites.forEach((oneSong, i)=> {
    console.log(oneSong.songId.toString());
    console.log(req.body.songId.toString());
    if(oneSong.songId.toString() === req.body.songId.toString()) {
      req.user.favorites.splice(i, 1);
    }
  });

  req.user.save((err, updatedUser) => {
    if (err) {
      console.log(err);
      res.status(400).json(err);
      return;
    }

    req.user.encryptedPassword = undefined;
    res.status(200).json(req.user);
  });
});

router.get('/api/song-by-id/:songId', (req, res, next) => {
  var propertiesObject = {
    track_id: req.params.songId,
    format:'json',
    callback:'callback',
    apikey: process.env.musixMatchApiKey
  };

  request.get({
    url: 'https://api.musixmatch.com/ws/1.1/track.get',
    qs: propertiesObject
  }, function(err, response, body) {

    res.json(body);
  });

});

router.get('/api/find-related/:artistId', (req, res, next) => {
  var propertiesObject = {
    artist_id: req.params.artistId,
    format:'json',
    callback:'callback',
    apikey: process.env.musixMatchApiKey,
    page_size: 5
  };

  request.get({
    url: 'https://api.musixmatch.com/ws/1.1/artist.related.get',
    qs: propertiesObject
  }, function(err, response, body) {

    res.json(body);
  });
});




module.exports = router;
