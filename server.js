const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const moviedata = require('./data.json');

app.get('/', homePagedHandeler);

app.get('/favourates', favouratesHandeler);

app.get('/error', errorHandelor);

app.get('*', notFoundHandeler);

//constructor
function Movie(title, poster_path, overview) {
    this.title = title;

    this.poster_path = poster_path;

    this.overview = overview;

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

        let oneMovie = new Movie(movie.title, movie.poster_path, movie.overview);

        movies.push(oneMovie);

    })
    return res.status(200).json(movies);
}

function errorHandelor(req, res) {
    return res.status(500).send(' status: 500  /  Sorry, something went wrong');
}

function notFoundHandeler(req, res) {
    return res.status(404).send('status: 404   /  page not found error');
}