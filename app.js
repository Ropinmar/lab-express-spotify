require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:
app.get('/', (req, res) => {
    // console.log(req)
    res.render('index')
});

app.get('/artist-search', (req, res) => {
    // console.log(req.query);
    const artistSearch = req.query.artist;
    spotifyApi
    .searchArtists(artistSearch)
        .then(data => {
            // const { artist } = data.body.artists.items
            res.render('artist-search-results', { artist: data.body.artists.items });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
    
});

app.get("/albums/:artistId", (req, res, next) =>{
    const albums = req.params.artistId;
    spotifyApi
    .getArtistAlbums(albums)
    .then(data => {
        res.render("albums", {albums: data.body.items})
    })
});

app.get("/tracks/:albumsId", (req, res, next) => {
    const tracks = req.params.albumsId;
    spotifyApi
    .getAlbumTracks(tracks)
    .then(data => {
        res.render("tracks", {tracks: data.body.items})
    })
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

