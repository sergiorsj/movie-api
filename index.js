const express = require('express');
const app = express();
const { check, validationResult } = require('express-validator');

const fs = require('fs'); // import built in node modules fs and path 
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
mongoose.connect('mongodb+srv://sergiorsj11:Passw0rd@myflixdb.aur59md.mongodb.net/myflixDB', { useNewUrlParser: true, useUnifiedTopology: true });
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
app.use(morgan('combined', {stream: accessLogStream}));

// mongodb+srv://sergiorsj11:Passw0rd@myflixdb.aur59md.mongodb.net/myflixDB

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const bodyParser = require('body-parser');
const uuid = require('uuid');

app.use(bodyParser.json());

let auth = require('./auth')(app);
const cors = require('cors');
app.use(cors());
const passport = require('passport');
require('./passport');

let users = [
    {
      id:'1',
      fullname: 'John',
      email: 'johndoe@mail.com',
      favMovies: [{
        title: 'Inception',
        director: 'Christopher Nolan',
        genre: 'Sci-Fi'
      }]
    },
    {
      id:'2',
      fullname: 'Jane',
      email: 'janedoe@mail.com',
      favMovies: [{
        title: 'Inception',
        director: 'Christopher Nolan',
        genre: 'Sci-Fi'
      }]
    }
  
  ];

let movies = [
    {
      title: 'Inception',
      director: 'Christopher Nolan',
      genre: 'Sci-Fi'
    },
    {
      title: 'Lord of the Rings',
      director: 'Peter Jackson',
      genre: 'Super-Heroes'
    },
    {
      title: 'The Matrix',
      director: 'Lana Wachowski',
      genre: 'Sci-fi'
    },
    {
        title: 'The Avengers',
        director: 'Anthony Russo',
        genre: 'Super-Heroes'
      },
      {
        title: 'The Silence Of The Lambs',
        director: 'Jonathan Demme',
        genre: 'Suspense-Thriller'
      },
      {
        title: 'Terminator',
        director: 'James Cameron',
        genre: 'Action'
      },
      {
        title: 'The Prestige',
        director: 'Christopher Nolan',
        genre: 'Suspense-Thriller'
      },
      {
        title: 'Shutter Island',
        director: 'Martin Scorsese',
        genre:'Suspense-Thriller'
      },
      {
        title: 'The Fugitive',
        director: 'Andrew Davis',
        genre: 'Suspense-Thriller'
      },
      {
        title: 'The Shack',
        director: 'Stuart Hazeldine',
        genre: 'Feel-Good'
      }
  ];


app.get('/', (req, res) => {
    res.send('Welcome to my movie API by Sergio!');
});

app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Require and use the auth router
const authRouter = require('./auth');
app.use('/auth', authRouter);

// Initialize Passport middleware
app.use(passport.initialize());

// READ
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});

//READ by title
app.get('/movies/:title', (req, res) => {
    const {title} = req.params;
    const movie = movies.find( movie => movie.title === title )

    if(movie){
        res.status(200).json(movie);
    }
    else{
        res.status(404).send('Movie not found :( ');
    }
});

//READ Genre by title
app.get('/movies/:title/genre', (req, res) => {
    const {title} = req.params;
    const movie = movies.find( movie => movie.title === title )

    if(movie){
        res.status(200).json(movie.genre);
    }
    else{
        res.status(404).send('Movie not found :( ');
    }
});

//READ Director by title
app.get('/movies/:title/director', (req, res) => {
    const {title} = req.params;
    const movie = movies.find( movie => movie.title === title )

    if(movie){
        res.status(200).json(movie.director);
    }
    else{
        res.status(404).send('Movie not found :( ');
    }
});

//READ Documentation
app.get('/documentation', (req, res) => {                  
    res.sendFile('public/documentation.html', { root: __dirname });
});

//Create new user
app.post('/users', async (req, res) => {
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Get all users
app.get('/users', async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Update user info
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find( user => user.id == id );

  if(user){
      user = {
        user: user.id,
        fullname: updatedUser.fullname,
        email: updatedUser.email,
        favMovies: user.favMovies
      };
      res.status(200).json(user);
  }
  else{
      res.status(400).send('not a registered user');
  }
});

//Update users favMovie
app.post('/users/:id/:title', (req, res) => {
  const { id , title } = req.params;
  

  let user = users.find( user => user.id == id );
  let newTitle = {
    title,
    director: req.body.director,
    genre: req.body.genre
  };
  
  if(user){
      user.favMovies.push(newTitle);
      res.status(200).send('user\'s favorite movies have been updated');
  }
  else{
      res.status(400).send('could not update favorite movies');
  }
  console.log(JSON.stringify(user.favMovies));
});

//Delete a favorite movie
app.delete('/users/:id/:title', (req, res) => {
  const { id , title } = req.params;
  let user = users.find( user => user.id == id );

  if(user){
    user = user.favMovies.filter( m => m.title !== title)
    res.status(200).send('user\'s favorite movies have been updated');
  }
  else{
      res.status(400).send('could not update favorite movies');
  }
  console.log(JSON.stringify(user));
});
//Delete a user
app.delete('/users/:id/', (req, res) => {
  const { id  } = req.params;
  let user = users.find( user => user.id == id );

  if(user){
    users = users.filter( user => user.id !== id)
    console.log(users);
    res.status(200).send('user has been deleted');
  }
  else{
      res.status(400).send('could not update user');
  }
  
});
//Server
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});