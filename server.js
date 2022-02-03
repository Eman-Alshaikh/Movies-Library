'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const PORT = process.env.PORT;
const app = express();
app.use(cors());
app.use(express.json()); // whenever you read from body -> parse it to json format 

const moviedata = require('./data.json');

//first:require pg// library using to create client 
const pg = require('pg');
// CREATE NEW BD in my machine 
//DATABASE_URL=postgres://student:emaneman2626@localhost:5432/theMovie
const client = new pg.Client(process.env.DATABASE_URL);
app.get('/', homePagedHandeler);

app.get('/favourates', favouratesHandeler);
app.get('/trending', moviesHandeler);
app.get('/search', searchMoviesHandler);

//getMovies: Create a get request to get all the data from the database
app.get('/getMovies', getMovieHandelor);
//addMovie : create a post request to save a specific movie to database along with your personal comments.
app.post('/addMovie', addMovieHandelor);
//    getMovie/id: Create a get request to get a specific movie from the database4

app.get('/getMovie/:id',oneFavMovieHandler);



//task14
// /UPDATE/id: create an update request to update your comments for a specific movie in the database.
app.put('/UPDATE/:id',updatamoviehandelor);
//   /DELETE/id : create a delete request to remove a specific movie from your database.
app.delete('/DELETE/:id',deletemoviehandelor);

app.use('/error', errorHandelor);
app.use('*', notFoundHandeler);
let numberOfMovies = 3;

let url = `https://api.themoviedb.org/3/movie/550?api_key=${process.env.APIKEY}&number=${numberOfMovies}&language=en-US`;
let url2 = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}&language=en-US`
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
        .then((result) => {
            console.log(result);
            result.data.results.forEach(movie => {


                newArr.push(new Movie(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview));
            })

            res.status(200).json(newArr);

        }).catch((err) => {

        })

}

function searchMoviesHandler(req, res) {
    let url = 'https://api.themoviedb.org/3/search/movie?api_key=668baa4bb128a32b82fe0c15b21dd699&language=en-US&query=The&page=2';
    axios.get(url)
        .then(result => {
            // console.log(result.data.recipes);
            let movies = result.data.results.map(movie => {
                return new Movie(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview);
            });
            res.status(200).json(movies);
        }).catch(err => {


        })
}
//getMovies: Create a get request to get all the data from the database
app.get('/getMovies', getMovieHandelor);
//addMovie : create a post request to save a specific movie to database along with your personal comments.
app.post('/addMovie', addMovieHandelor);


//getMovies: Create a get request to get all the data from the database
//app.get('/getMovies',getMovieHandelor);
function addMovieHandelor(req, res) {
    console.log(req.body);
    const movie = req.body;
    console.log(movie);
    let sql = `INSERT INTO favmovie(title,release_date,poster_path,overview,comment) VALUES($1,$2,$3,$4,$5) RETURNING *;`
    let values = [movie.title, movie.release_date, movie.poster_path, movie.overview, movie.comment];
    client.query(sql, values).then(data => {
        res.status(200).json(data.rows);
    }).catch(error => {
        errorHandelor(req, res)
    });
}

//addMovie : create a post request to save a specific movie to database along with your personal comments.

//app.post('/addMovie',addMovieHandelor);
function getMovieHandelor(req, res) {
    let sql = `SELECT * FROM favmovie;`;
    client.query(sql).then(data => {
        res.status(200).json(data.rows);
    }).catch(error => {
        errorHandelor(req, res)
    });

}
 

// /UPDATE/id: create an update request to update your comments for a specific movie in the database.
//app.put('/UPDATE',updatamoviehandelor);
//update sth that already exist 
function updatamoviehandelor(req,res)
{
    //het the id to send in the url request
 const id= req.params.id;
// send the updated data using sql statement which will update
console.log(req.params.name);
const movie = req.body;
const sql = `UPDATE favMovie; SET title =$1,release_date= $2, poster_path= $3 ,overview=$4, comment=$5  WHERE id=$6 RETURNING *;`; 
let values = [movie.title, movie.release_date, movie.poster_path, movie.overview, movie.comment,id];


 client.query(sql,values).then(data=>{
    res.status(200).json(data.rows); 
 }).catch(error=>{
    errorHandelor(req, res)
});

// UPDATE table_name
// SET column1 = value1, column2 = value2, ...
// WHERE condition;
}

 

//   /DELETE/id : create a delete request to remove a specific movie from your database.
 function deletemoviehandelor(req,res)
 {
    const id = req.params.id;
    const sql = `DELETE FROM favMovie WHERE id=${id};` 
    // DELETE FROM table_name WHERE condition;

    client.query(sql).then(()=>{
        res.status(200).send("The movie has been deleted");
       
    }).catch(error=>{
        errorHandelor(req,res);
    });
 }

//    getMovie/id: Create a get request to get a specific movie from the database


function oneFavMovieHandler(req,res){

    let sql = `SELECT * FROM favMovie WHERE id=${req.params.id};`;
 
    client.query(sql).then(data=>{
       res.status(200).json(data.rows);
    }).catch(error=>{
        errorHandelor(req,res);
    });
}

function errorHandelor(req, res) {

    return res.status(500).send('status: 500   /    error');
}

function notFoundHandeler(req, res) {
    return res.status(404).send('status: 404   /  page not found error');
}


//to connect to the DBfirstly , then after successfull connection -> run the server 

client.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`listining to port ${PORT}`)
    })
})