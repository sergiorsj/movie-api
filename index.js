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

// Require and use the auth router
const authRouter = require('./auth');
app.use('/auth', authRouter);

// Initialize Passport middleware
app.use(passport.initialize());

// READ
app.get('/movies', (req, res) => {
  Movies.find()
  .then((movies) => {res.json(movies)})
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      })
});

//READ by title
app.get('/movies/:title', (req, res) => {
    const {title} = req.params;
    Movies.findOne({Title: title})
    .then((movie) => {res.json(movie)})
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
});

//READ Genre by title
app.get('/movies/genre/:genre', (req, res) => {
    const {genre} = req.params;
    Movies.findOne({"Genre.Name": genre})
    .then((movie) => {res.json(movie.Genre)})
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
});

//READ Director by title
app.get('/movies/director/:director', (req, res) => {
    const {director} = req.params;
    Movies.findOne({"Director.Name": director})
    .then((movie) => {res.json(movie.Director)})
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
});

//READ Documentation
app.get('/documentation', (req, res) => {                  
    res.sendFile('public/documentation.html', { root: __dirname });
});

//Create new user
app.post('/users', async (req, res) => {
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
    //  if (!user) {
    //    return res.status(400).send("Error in registration");
    //  } else {
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
     // }
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

// Get a user by username
app.get('/users/:Username', async (req, res) => {
  await Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
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
app.post('/users/:id/:username', async (req, res) => {
  const { id , username } = req.params;

  await Users.findOneAndUpdate({ username: username }, {
    $push: { FavoriteMovies: id}
},
{ new: true})
.then((updatedUser) => {
    res.json(updatedUser);
})
});

//Delete a favorite movie
app.delete('/users/:id/:username', async (req, res) => {
  const { id , username } = req.params;

  await Users.findOneAndUpdate({ username: username }, {
    $pull: { FavoriteMovies: id}
},
{ new: true})
.then((updatedUser) => {
    res.json(updatedUser);
})
});

//Delete a user
app.delete('/user/delete/:id/', async (req, res) => {
  const { id  } = req.params;
  await Users.findOneAndDelete({ Username: id })
  .then((user) => {
    res.status(200) .send(id + ' was deleted ');
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });  
});
//Server
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});