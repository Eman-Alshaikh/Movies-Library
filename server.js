'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const PORT = process.env.PORT;
const app = express();
app.use(cors());

const moviedata = require('./data.json');

app.get('/', homePagedHandeler);

app.get('/favourates', favouratesHandeler);
app.get('/trending', moviesHandeler);
app.get('/search',searchMoviesHandler);

app.use('/error', errorHandelor);

 

app.use('*', notFoundHandeler);
let numberOfMovies=3;

let url = `https://api.themoviedb.org/3/movie/550?api_key=${process.env.APIKEY}&number=${numberOfMovies}&language=en-US`;
let url2=`https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}&language=en-US`
//constructor
function Movie(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;

    this.poster_path = poster_path;

    this.overview = overview;

}

function favouratesHandeler(req, res) {
    return res.status(200).send("Welcome to Favorite Page");
}
app.listen(PORT, () => {
    console.log(`listining to port ${PORT}`)
});


function homePagedHandeler(req, res) {
    let movies = [];
    moviedata.data.map(movie => {

        let oneMovie = new Movie(movie.title, movie.poster_path, movie.overview);

        movies.push(oneMovie);

    })
    return res.status(200).json(movies);
}


function moviesHandeler(req, res) {
    let newArr = [];
    axios.get(url2)
     .then((result)=>{
      console.log(result);
       result.data.results.forEach(movie => {
           
     
        newArr.push(new Movie(movie.id,movie.title,movie.release_date,movie.poster_path,movie.overview));
       })
    
        res.status(200).json(newArr);

    }).catch((err)=>{
           
    })
    
}

function searchMoviesHandler(req,res)
{
    let url ='https://api.themoviedb.org/3/search/movie?api_key=668baa4bb128a32b82fe0c15b21dd699&language=en-US&query=The&page=2';
    axios.get(url)
    .then(result=>{
        // console.log(result.data.recipes);
        let movies = result.data.results.map(movie =>{
            return new Movie(movie.id,movie.title,movie.release_date,movie.poster_path,movie.overview);
        });
        res.status(200).json(movies);  
     }).catch(err=>{
       

    })
}
function  errorHandelor(req, res) {
   
    return res.status(500).send('status: 500   /    error');
}

function notFoundHandeler(req, res) {
    return res.status(404).send('status: 404   /  page not found error');
}
