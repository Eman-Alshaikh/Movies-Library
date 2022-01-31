const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const moviedata = require('./data.json');

app.get('/', homePagedHandeler);

app.get('/favourates', favouratesHandeler);

app.get('/error',errorHandelor);

app.get('*',notFoundHandeler);

//constructor
function Movie(title, genre_ids, original_language, original_title, poster_path, video, vote_average, overview, release_date, vote_count, id, adult, backdrop_path, popularity, media_type) {
    this.title = title;
    this.genre_ids = genre_ids;
    this.original_language = original_language;
    this.original_title = original_title;
    this.poster_path = poster_path;
    this.video = video;
    this.vote_average = vote_average;
    this.overview = overview;
    this.release_date = release_date;
    this.vote_count = vote_count;
    this.id = id;
    this.adult = adult;
    this.backdrop_path = backdrop_path;
    this.popularity = popularity;
    this.media_type = media_type;
}

function favouratesHandeler(req, res) {
    return res.status(200).send("Welcome to Favorite Page");
}
app.listen(3000, () => {
    console.log('listene to port 3000');
});


function homePagedHandeler(req, res) {
    let movies = [];
    moviedata.data.map(movie => {

        let oneMovie = new Movie(movie.title, movie.genre_ids,
            movie.original_language, movie.original_title,
            movie.poster_path, movie.video, movie.vote_average,
            movie.overview, movie.release_date, movie.vote_count,
            movie.id, movie.adult, movie.backdrop_path, movie.popularity,
            movie.media_type)

        movies.push(oneMovie);

    })
    return res.status(200).json(movies);
}

function errorHandelor(req,res)
{
    return res.status(500).send(' status: 500  /  Sorry, something went wrong');
}

function notFoundHandeler (req,res)
{
    return res.status(404).send('status: 404   /  page not found error');
}